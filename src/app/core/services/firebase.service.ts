import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  Timestamp,
  Unsubscribe,
  increment,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseCoreService } from './firebase-core.service';
import { Topping, Cubierta, PrecioVaso, ProductoPopular, Pedido, PedidoStatus, Gasto, Producto, Visita } from '../models/product.model';

export interface ContactInfo {
  direccion?: string;
  telefono?:  string;
  horario?:   string;
  dias?:      string;
}

@Injectable({ providedIn: 'root' })
export class FirebaseService implements OnDestroy {
  private core = inject(FirebaseCoreService);
  private db   = this.core.db;

  // ── Signals reactivos ─────────────────────────────────────────────────────
  allToppings  = signal<Topping[]>([]);
  allCubiertas = signal<Cubierta[]>([]);
  allPrecios   = signal<PrecioVaso[]>([]);
  allPopulares = signal<ProductoPopular[]>([]);
  allProductos = signal<Producto[]>([]);
  allPedidos   = signal<Pedido[]>([]);
  allGastos    = signal<Gasto[]>([]);
  allVisitas   = signal<Visita[]>([]);
  logoUrl      = signal<string>('');
  contactInfo  = signal<ContactInfo>({});
  statsVisits  = signal<number>(0);

  toppings  = signal<Topping[]>([]);
  cubiertas = signal<Cubierta[]>([]);
  precios   = signal<PrecioVaso[]>([]);
  populares = signal<ProductoPopular[]>([]);

  private unsubs: Unsubscribe[] = [];

  constructor() {
    this.unsubs.push(
      onSnapshot(collection(this.db, 'toppings'), snap => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Topping);
        this.allToppings.set(all);
        this.toppings.set(all.filter(t => t.available));
      }),
      onSnapshot(collection(this.db, 'cubiertas'), snap => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Cubierta);
        this.allCubiertas.set(all);
        this.cubiertas.set(all.filter(c => c.available));
      }),
      onSnapshot(collection(this.db, 'precios'), snap => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }) as PrecioVaso);
        this.allPrecios.set(all);
        this.precios.set(all.filter(p => p.available));
      }),
      onSnapshot(collection(this.db, 'populares'), snap => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }) as ProductoPopular);
        this.allPopulares.set(all);
        this.populares.set(all.filter(p => p.visible).sort((a, b) => a.orden - b.orden));
      }),
      onSnapshot(collection(this.db, 'productos'), snap => {
        const productos = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Producto);
        this.allProductos.set(productos);
      }),
      onSnapshot(doc(this.db, 'config', 'branding'), snap => {
        const data = snap.data();
        this.logoUrl.set((data?.['logoUrl'] as string) ?? '');
        this.contactInfo.set({
          direccion: data?.['direccion'] ?? '',
          telefono:  data?.['telefono']  ?? '',
          horario:   data?.['horario']   ?? '',
          dias:      data?.['dias']      ?? '',
        });
      }),
      onSnapshot(doc(this.db, 'config', 'stats'), snap => {
        const data = snap.data();
        this.statsVisits.set(data?.['visits'] ?? 0);
      })
    );

    // ── Listeners Protegidos (Requieren Auth) ──
    let authUnsubs: Unsubscribe[] = [];
    
    onAuthStateChanged(this.core.auth, user => {
      if (user) {
        authUnsubs.push(
          onSnapshot(collection(this.db, 'pedidos'), snap => {
            const pedidos = snap.docs
              .map(d => {
                const data = d.data();
                return {
                  id: d.id,
                  ...data,
                  timestamp: (data['timestamp'] as Timestamp)?.toDate?.() ?? new Date(),
                  status: data['status'] ?? 'pendiente',
                } as Pedido;
              })
              .sort((a, b) => {
                const ta = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
                const tb = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
                return tb - ta;
              });
            this.allPedidos.set(pedidos);
          }, err => console.error('Error pedidos:', err)),
          
          onSnapshot(collection(this.db, 'gastos'), snap => {
            const gastos = snap.docs
              .map(d => {
                const data = d.data();
                return {
                  id: d.id,
                  ...data,
                  timestamp: (data['timestamp'] as Timestamp)?.toDate?.() ?? new Date(),
                } as Gasto;
              })
              .sort((a, b) => {
                const ta = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
                const tb = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
                return tb - ta;
              });
            this.allGastos.set(gastos);
          }, err => console.error('Error gastos:', err)),
          
          onSnapshot(collection(this.db, 'visits'), snap => {
            const visitas = snap.docs.map(d => {
              const data = d.data();
              return {
                id: d.id,
                timestamp: (data['timestamp'] as Timestamp)?.toDate?.() ?? new Date(),
              } as Visita;
            });
            this.allVisitas.set(visitas);
          }, err => console.error('Error visits:', err))
        );
      } else {
        // Limpiar subscripciones y datos cuando se cierra sesión
        authUnsubs.forEach(u => u());
        authUnsubs = [];
        this.allPedidos.set([]);
        this.allGastos.set([]);
        this.allVisitas.set([]);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubs.forEach(u => u());
  }

  async incrementVisit(): Promise<void> {
    // Registramos el documento de visita (colección pública, siempre debe
    // funcionar para visitantes anónimos) y, por separado, intentamos
    // actualizar el contador agregado. Van en try/catch INDEPENDIENTES:
    // si uno falla (p.ej. el contador, que requiere sesión de admin) no debe
    // impedir que el otro se guarde.
    try {
      await addDoc(collection(this.db, 'visits'), {
        timestamp: new Date()
      });
    } catch { /* no crítico */ }

    try {
      await setDoc(
        doc(this.db, 'config', 'stats'),
        { visits: increment(1) },
        { merge: true }
      );
    } catch { /* no crítico: requiere sesión, puede fallar para visitantes anónimos */ }
  }

  async savePedido(data: Omit<Pedido, 'id'>): Promise<void> {
    await addDoc(collection(this.db, 'pedidos'), {
      ...data,
      status: 'pendiente',
      timestamp: Timestamp.fromDate(data.timestamp),
    });
  }

  async updatePedidoStatus(id: string, status: PedidoStatus): Promise<void> {
    await updateDoc(doc(this.db, 'pedidos', id), { status });
  }

  async saveLogo(url: string): Promise<void> {
    await setDoc(doc(this.db, 'config', 'branding'), { logoUrl: url }, { merge: true });
  }

  async saveContactInfo(info: ContactInfo): Promise<void> {
    await setDoc(doc(this.db, 'config', 'branding'), info, { merge: true });
  }

  async saveGasto(data: Omit<Gasto, 'id'>): Promise<void> {
    await addDoc(collection(this.db, 'gastos'), {
      ...data,
      timestamp: Timestamp.fromDate(data.timestamp),
    });
  }

  async deleteGasto(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'gastos', id));
  }

  async add(colName: string, data: object): Promise<void> {
    await addDoc(collection(this.db, colName), data);
  }

  async update(colName: string, id: string, data: object): Promise<void> {
    await updateDoc(doc(this.db, colName, id), data);
  }

  async delete(colName: string, id: string): Promise<void> {
    await deleteDoc(doc(this.db, colName, id));
  }
}
