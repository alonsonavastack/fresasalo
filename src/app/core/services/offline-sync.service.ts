import { Injectable, signal, computed, NgZone, inject, OnDestroy } from '@angular/core';
import { Pedido } from '../models/product.model';
import { FirebaseService } from './firebase.service';

export interface VentaOffline extends Omit<Pedido, 'id'> {
  localId: string;
  syncStatus: 'pendiente' | 'sincronizado' | 'error';
  intentos: number;
}

const DB_NAME    = 'fresasAlo_offline';
const DB_VERSION = 1;
const STORE_NAME = 'ventas_pendientes';

@Injectable({ providedIn: 'root' })
export class OfflineSyncService implements OnDestroy {
  private fb   = inject(FirebaseService);
  private zone = inject(NgZone);

  isOnline       = signal<boolean>(navigator.onLine);
  pendingCount   = signal<number>(0);
  isSyncing      = signal<boolean>(false);
  lastSyncMsg    = signal<string>('');

  private db: IDBDatabase | null = null;
  private onlineHandler  = () => this.zone.run(() => { this.isOnline.set(true);  this.syncAll(); });
  private offlineHandler = () => this.zone.run(() => { this.isOnline.set(false); });

  constructor() {
    window.addEventListener('online',  this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);
    this.initDB().then(() => this.refreshPendingCount());
  }

  ngOnDestroy() {
    window.removeEventListener('online',  this.onlineHandler);
    window.removeEventListener('offline', this.offlineHandler);
    this.db?.close();
  }

  // ── INIT ──────────────────────────────────────────────────────────────────
  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'localId' });
        }
      };

      req.onsuccess = (e) => {
        this.db = (e.target as IDBOpenDBRequest).result;
        resolve();
      };

      req.onerror = () => reject(req.error);
    });
  }

  // ── GUARDAR LOCAL ──────────────────────────────────────────────────────────
  async saveLocal(data: Omit<Pedido, 'id'>): Promise<string> {
    await this.ensureDB();
    const localId = 'local_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    const venta: VentaOffline = { ...data, localId, syncStatus: 'pendiente', intentos: 0 };

    return new Promise((resolve, reject) => {
      const tx  = this.db!.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).add(venta);
      req.onsuccess = () => { this.refreshPendingCount(); resolve(localId); };
      req.onerror   = () => reject(req.error);
    });
  }

  // ── CHECKOUT PRINCIPAL (usa online/offline automáticamente) ───────────────
  async checkout(data: Omit<Pedido, 'id'>): Promise<{ modo: 'online' | 'offline' }> {
    if (this.isOnline()) {
      try {
        await this.fb.savePedido(data);
        return { modo: 'online' };
      } catch {
        // Si falla aunque hay internet, guarda local
        await this.saveLocal(data);
        return { modo: 'offline' };
      }
    } else {
      await this.saveLocal(data);
      return { modo: 'offline' };
    }
  }

  // ── SINCRONIZAR TODAS LAS VENTAS PENDIENTES ───────────────────────────────
  async syncAll(): Promise<void> {
    if (!this.isOnline() || this.isSyncing()) return;

    const pendientes = await this.getPendientes();
    if (pendientes.length === 0) return;

    this.isSyncing.set(true);
    this.lastSyncMsg.set('');
    let synced = 0;
    let errors = 0;

    for (const venta of pendientes) {
      try {
        const { localId, syncStatus, intentos, ...pedidoData } = venta;
        await this.fb.savePedido(pedidoData);
        await this.deleteLocal(venta.localId);
        synced++;
      } catch (e) {
        await this.markError(venta.localId, venta.intentos + 1);
        errors++;
        console.error('Error sincronizando venta:', e);
      }
    }

    this.zone.run(() => {
      this.isSyncing.set(false);
      this.refreshPendingCount();
      if (synced > 0) {
        this.lastSyncMsg.set(`✅ ${synced} venta${synced > 1 ? 's' : ''} sincronizada${synced > 1 ? 's' : ''}`);
        setTimeout(() => this.zone.run(() => this.lastSyncMsg.set('')), 4000);
      }
    });
  }

  // ── GETTERS ────────────────────────────────────────────────────────────────
  private getPendientes(): Promise<VentaOffline[]> {
    return new Promise(async (resolve) => {
      await this.ensureDB();
      const tx    = this.db!.transaction(STORE_NAME, 'readonly');
      const req   = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve((req.result as VentaOffline[]).filter(v => v.syncStatus !== 'sincronizado'));
      req.onerror   = () => resolve([]);
    });
  }

  private deleteLocal(localId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx  = this.db!.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).delete(localId);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  }

  private markError(localId: string, intentos: number): Promise<void> {
    return new Promise(async (resolve) => {
      await this.ensureDB();
      const tx    = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const get   = store.get(localId);
      get.onsuccess = () => {
        const rec = get.result as VentaOffline;
        if (rec) {
          rec.intentos   = intentos;
          rec.syncStatus = intentos >= 5 ? 'error' : 'pendiente';
          store.put(rec);
        }
        resolve();
      };
      get.onerror = () => resolve();
    });
  }

  private refreshPendingCount(): void {
    this.getPendientes().then(p =>
      this.zone.run(() => this.pendingCount.set(p.length))
    );
  }

  private ensureDB(): Promise<void> {
    if (this.db) return Promise.resolve();
    return this.initDB();
  }

  // Para que el POS pueda forzar un sync manual
  forceSync(): void { this.syncAll(); }
}
