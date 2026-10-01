import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FirebaseService } from '../../../core/services/firebase.service';

export interface ClienteAgrupado {
  telefono: string;
  nombres: string[];
  nombrePrincipal: string;
  totalPedidos: number;
  totalGastado: number;
  ultimoPedido: Date;
  favoritosStr: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './clientes.component.html',
})
export class ClientesComponent {
  private fb = inject(FirebaseService);
  private datePipe = inject(DatePipe);

  clientes = computed<ClienteAgrupado[]>(() => {
    const pedidos = this.fb.allPedidos();
    const map = new Map<string, ClienteAgrupado>();

    pedidos.forEach((p) => {
      if (!p.telefonoCliente || p.telefonoCliente === 'N/A') return;
      if (p.status === 'cancelado') return;

      const tel = p.telefonoCliente.trim();
      if (!map.has(tel)) {
        map.set(tel, {
          telefono: tel,
          nombres: [],
          nombrePrincipal: p.nombreCliente,
          totalPedidos: 0,
          totalGastado: 0,
          ultimoPedido: p.timestamp,
          favoritosStr: '',
        });
      }

      const c = map.get(tel)!;
      c.totalPedidos++;
      c.totalGastado += p.totalPrecio;

      if (p.timestamp.getTime() > c.ultimoPedido.getTime()) {
        c.ultimoPedido = p.timestamp;
        c.nombrePrincipal = p.nombreCliente;
      }

      if (!c.nombres.includes(p.nombreCliente)) {
        c.nombres.push(p.nombreCliente);
      }
    });

    map.forEach((c) => {
      const tallyToppings: Record<string, number> = {};
      const tallyCubiertas: Record<string, number> = {};

      const susPedidos = pedidos.filter(
        (p) => p.telefonoCliente?.trim() === c.telefono && p.status !== 'cancelado',
      );

      susPedidos.forEach((p) => {
        p.vasos.forEach((v) => {
          if (v.cubiertaName) {
            tallyCubiertas[v.cubiertaName] = (tallyCubiertas[v.cubiertaName] || 0) + v.cantidad;
          }
          v.toppingNames.forEach((t) => {
            tallyToppings[t] = (tallyToppings[t] || 0) + v.cantidad;
          });
        });
      });

      const topCubierta = Object.entries(tallyCubiertas).sort((a, b) => b[1] - a[1])[0];
      const topToppings = Object.entries(tallyToppings)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2);

      let fav = '';
      if (topCubierta) fav += `🍫 ${topCubierta[0]}`;
      if (topToppings.length > 0)
        fav += (fav ? '  ✨ ' : '✨ ') + topToppings.map((t) => t[0]).join(', ');
      c.favoritosStr = fav || 'Sin favoritos claros';
    });

    return Array.from(map.values()).sort((a, b) => b.totalGastado - a.totalGastado);
  });

  formatFecha(date: Date): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'd MMM y, h:mm a') || '';
  }
}
