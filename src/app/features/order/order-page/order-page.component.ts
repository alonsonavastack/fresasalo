<<<<<<< HEAD
import {
  Component,
  inject,
  OnInit,
  effect,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
=======
import { Component, inject, OnInit, effect } from '@angular/core';
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
import { FirebaseService } from '../../../core/services/firebase.service';
import { OrderService } from '../../../core/services/order.service';
import { WhatsappService } from '../../../core/services/whatsapp.service';
import { AnimateService } from '../../../core/services/animate.service';
import { OfflineSyncService } from '../../../core/services/offline-sync.service';
import { VasoCardComponent } from '../vaso-card/vaso-card.component';
import { VasoPedido, ProductoPopular, PrecioVaso } from '../../../core/models/product.model';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [VasoCardComponent],
<<<<<<< HEAD
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './order-page.component.html',
})
export class OrderPageComponent implements OnInit {
  fb = inject(FirebaseService);
  orderService = inject(OrderService);
  anim = inject(AnimateService);
  offline = inject(OfflineSyncService);
  private whatsapp = inject(WhatsappService);

  logoLoaded = false;
  logoError = false;
  isSending = false;
  popularesLoaded: Record<string, boolean> = {};
  popularesError: Record<string, boolean> = {};

  // Validación de nombre/teléfono: solo mostramos el error después de que
  // el cliente interactuó con el campo (blur) o intentó enviar el pedido.
  nombreTouched = signal(false);
  telefonoTouched = signal(false);

  nombreError = computed(() =>
    this.nombreTouched() && this.orderService.nombreCliente().trim().length === 0
      ? 'Ingresa tu nombre para poder identificar tu pedido.'
      : '',
  );

  telefonoError = computed(() =>
    this.telefonoTouched() && !this.orderService.telefonoValido()
      ? 'Ingresa un número de WhatsApp válido (mínimo 10 dígitos). Lo usamos para registrar y contactar tu pedido.'
      : '',
  );

  // Aviso visible cuando el pedido no se pudo guardar en nuestros registros
  // (el mensaje de WhatsApp se envía igual, pero el negocio no tendrá el registro).
  saveWarning = signal('');
  private saveWarningTimer: ReturnType<typeof setTimeout> | null = null;
=======
  templateUrl: './order-page.component.html'
})
export class OrderPageComponent implements OnInit {
  fb           = inject(FirebaseService);
  orderService = inject(OrderService);
  anim         = inject(AnimateService);
  offline      = inject(OfflineSyncService);
  private whatsapp = inject(WhatsappService);

  logoLoaded = false;
  logoError  = false;
  isSending  = false;
  popularesLoaded: Record<string, boolean> = {};
  popularesError:  Record<string, boolean> = {};
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee

  private lastLogoUrl = '';

  constructor() {
    // Cuando llega una URL de logo nueva y válida, reiniciar el estado de carga
    effect(() => {
      const url = this.fb.logoUrl();
      if (url && url !== this.lastLogoUrl) {
        this.lastLogoUrl = url;
<<<<<<< HEAD
        this.logoLoaded = false;
        this.logoError = false;
=======
        this.logoLoaded  = false;
        this.logoError   = false;
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
      }
    });
  }

  ngOnInit() {
    this.fb.incrementVisit();
    this.offline.forceSync();
  }

<<<<<<< HEAD
  onLogoLoad() {
    this.logoLoaded = true;
  }
  onLogoError() {
    this.logoError = true;
    this.logoLoaded = true;
  }

  onPopularLoad(id: string) {
    this.popularesLoaded[id] = true;
  }
  onPopularError(id: string) {
    this.popularesError[id] = true;
    this.popularesLoaded[id] = true;
  }
=======
  onLogoLoad()  { this.logoLoaded = true; }
  onLogoError() { this.logoError = true; this.logoLoaded = true; }

  onPopularLoad(id: string)  { this.popularesLoaded[id] = true; }
  onPopularError(id: string) { this.popularesError[id] = true; this.popularesLoaded[id] = true; }
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee

  preciosDePopular(popular: ProductoPopular): PrecioVaso[] {
    const ids = popular.preciosIds ?? [];
    if (ids.length === 0) return [];
<<<<<<< HEAD
    return this.fb
      .allPrecios()
      .filter((p) => ids.includes(p.id))
=======
    return this.fb.allPrecios()
      .filter(p => ids.includes(p.id))
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
      .sort((a, b) => a.precio - b.precio);
  }

  async sharePopular(popular: ProductoPopular) {
    const text = `¡Mira esta delicia que encontré! 🍓🤤\n⭐ *${popular.nombre}*\n\nPídela aquí: https://fresaconcrema.netlify.app/`;
    if (navigator.share) {
      try {
        let filesArray: File[] = [];
        if (popular.imageUrl) {
          try {
            const response = await fetch(popular.imageUrl);
<<<<<<< HEAD
            const blob = await response.blob();
            const file = new File([blob], 'producto.jpg', { type: blob.type || 'image/jpeg' });
=======
            const blob     = await response.blob();
            const file     = new File([blob], 'producto.jpg', { type: blob.type || 'image/jpeg' });
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
            // @ts-ignore
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              filesArray = [file];
            }
<<<<<<< HEAD
          } catch (e) {
            console.error('No se pudo adjuntar la imagen', e);
          }
=======
          } catch (e) { console.error('No se pudo adjuntar la imagen', e); }
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
        }
        if (filesArray.length > 0) {
          await navigator.share({ title: 'Fresas con Crema ALO', text, files: filesArray });
        } else {
          await navigator.share({ title: 'Fresas con Crema ALO', text });
        }
<<<<<<< HEAD
      } catch (err) {
        console.error('Error sharing:', err);
      }
=======
      } catch (err) { console.error('Error sharing:', err); }
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  }

  updateNombre(event: Event): void {
    this.orderService.nombreCliente.set((event.target as HTMLInputElement).value);
  }

  updateTelefono(event: Event): void {
    this.orderService.telefonoCliente.set((event.target as HTMLInputElement).value);
  }

<<<<<<< HEAD
  onNombreBlur(): void {
    this.nombreTouched.set(true);
  }

  onTelefonoBlur(): void {
    this.telefonoTouched.set(true);
  }

=======
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
  onVasoChange(vaso: VasoPedido): void {
    this.orderService.updateVaso(vaso);
  }

  onRemoveVaso(id: string): void {
    this.orderService.removeVaso(id);
  }

  sendOrder(): void {
<<<<<<< HEAD
    // Marcar los campos como "tocados" para que, si faltan datos válidos,
    // se muestren los mensajes de error correspondientes al intentar enviar.
    this.nombreTouched.set(true);
    this.telefonoTouched.set(true);

    if (!this.orderService.hasVasos() || this.isSending) return;
    this.isSending = true;

    const nombre = this.orderService.nombreCliente().trim();
    const telefono = this.orderService.telefonoCliente().trim();
    const vasos = this.orderService.vasos();
    const totalVasos = this.orderService.totalVasos();
    const totalPrecio = this.orderService.totalPrecio();

    const mensaje = this.whatsapp.buildMessage(nombre, telefono, vasos);
    this.offline
      .checkout({
        nombreCliente: nombre,
        telefonoCliente: telefono,
        vasos,
        totalVasos,
        totalPrecio,
        timestamp: new Date(),
        mensaje,
      })
      .catch((err) => {
        console.error('Error guardando pedido:', err);
        this.showSaveWarning();
      });

    this.whatsapp.send(nombre, telefono, vasos);
    this.orderService.reset();
    this.nombreTouched.set(false);
    this.telefonoTouched.set(false);
    setTimeout(() => {
      this.isSending = false;
    }, 3000);
  }

  private showSaveWarning(): void {
    this.saveWarning.set(
      'Tu pedido se envió por WhatsApp, pero no pudimos guardarlo en nuestro registro. Si no recibes confirmación, vuelve a escribirnos.',
    );
    if (this.saveWarningTimer) clearTimeout(this.saveWarningTimer);
    this.saveWarningTimer = setTimeout(() => this.saveWarning.set(''), 8000);
=======
    if (!this.orderService.hasVasos() || this.isSending) return;
    this.isSending = true;

    const nombre      = this.orderService.nombreCliente();
    const telefono    = this.orderService.telefonoCliente();
    const vasos       = this.orderService.vasos();
    const totalVasos  = this.orderService.totalVasos();
    const totalPrecio = this.orderService.totalPrecio();

    const mensaje = this.whatsapp.buildMessage(nombre, telefono, vasos);
    this.offline.checkout({
      nombreCliente:   nombre   || 'Cliente',
      telefonoCliente: telefono || 'N/A',
      vasos,
      totalVasos,
      totalPrecio,
      timestamp: new Date(),
      mensaje,
    }).catch(err => console.error('Error guardando pedido:', err));

    this.whatsapp.send(nombre, telefono, vasos);
    this.orderService.reset();
    setTimeout(() => { this.isSending = false; }, 3000);
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
  }
}
