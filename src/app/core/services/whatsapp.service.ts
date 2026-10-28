import { Injectable, inject } from '@angular/core';
import { VasoPedido } from '../models/product.model';
import { FirebaseService } from './firebase.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private phone = environment.whatsappNumber;
  private fb    = inject(FirebaseService);

  buildMessage(nombreCliente: string, telefonoCliente: string, vasos: VasoPedido[]): string {
    let msg = `🍓 *PEDIDO - Fresas con Crema ALO* 🍓\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 Cliente: *${nombreCliente}*\n`;
    msg += `📞 Teléfono: *${telefonoCliente}*\n`;

    vasos.forEach((vaso, i) => {
      msg += `\n🥤 *VASO ${i + 1}*${vaso.combinado ? ' _(COMBINADO)_' : ''}\n`;
      msg += `   💰 Tamaño: ${vaso.precioLabel ?? ''} $${vaso.precio}\n`;
      msg += `   🔢 Cantidad: ${vaso.cantidad}\n`;
      msg += `   🍫 Cubierta: ${vaso.cubiertaName || 'Sin cubierta'}\n`;
      if (vaso.toppingNames && vaso.toppingNames.length > 0) {
        msg += `   ✨ Toppings:\n`;
        vaso.toppingNames.forEach(t => { msg += `      • ${t}\n`; });
      } else {
        msg += `   ✨ Sin toppings\n`;
      }
      if (vaso.notas) {
        msg += `   📝 Notas: ${vaso.notas}\n`;
      }
    });

    const totalVasos  = vasos.reduce((sum, v) => sum + v.cantidad, 0);
    const totalPrecio = vasos.reduce((sum, v) => sum + v.precio * v.cantidad, 0);

    msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🧮 Total vasos: *${totalVasos}*\n`;
    msg += `💵 Total estimado: *$${totalPrecio}*\n`;
    msg += `\n_Pedido enviado desde la web_ 🌐`;

    return msg;
  }

  async send(nombreCliente: string, telefonoCliente: string, vasos: VasoPedido[]): Promise<void> {
    const mensaje     = this.buildMessage(nombreCliente, telefonoCliente, vasos);
    const totalVasos  = vasos.reduce((sum, v) => sum + v.cantidad, 0);
    const totalPrecio = vasos.reduce((sum, v) => sum + v.precio * v.cantidad, 0);
    const encoded     = encodeURIComponent(mensaje);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `whatsapp://send?phone=${this.phone}&text=${encoded}`
      : `https://wa.me/${this.phone}?text=${encoded}`;

    window.open(url, '_blank');
  }
}
