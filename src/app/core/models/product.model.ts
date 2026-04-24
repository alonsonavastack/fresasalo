export interface Topping {
  id: string;
  name: string;
  imageUrl: string;
  available: boolean;
  popular: boolean;
  order: number;
}

export interface Cubierta {
  id: string;
  name: string;
  imageUrl: string;
  available: boolean;
}

export interface PrecioProducto {
  label: string;
  precio: number;
}

export interface Producto {
  id: string;
  nombre: string;
  emoji: string;
  available: boolean;
  orden: number;
  precios: PrecioProducto[];
}

export interface PrecioVaso {
  id: string;
  precio: number;
  label: string;
  available: boolean;
}

export interface VasoPedido {
  id: string;
  productoNombre?: string;
  productoEmoji?: string;
  precio: number;
  precioLabel?: string;
  toppings: string[];
  toppingNames: string[];
  cubierta: string;
  cubiertaName: string;
  combinado: boolean;
  cantidad: number;
  notas: string;
}

export type PedidoStatus =
  | 'pendiente'
  | 'recibido'
  | 'en_preparacion'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

export interface Pedido {
  id: string;
  nombreCliente: string;
  telefonoCliente: string;
  vasos: VasoPedido[];
  totalVasos: number;
  totalPrecio: number;
  timestamp: Date;
  mensaje: string;
  status?: PedidoStatus;
}

export interface ProductoPopular {
  id: string;
  nombre: string;
  descripcion: string;
  imageUrl: string;
  preciosIds: string[];
  visible: boolean;
  orden: number;
}

export type CategoriaGasto = 'Insumos' | 'Empaques' | 'Servicios' | 'Sueldos' | 'Otros';

export interface Gasto {
  id: string;
  monto: number;
  concepto: string;
  categoria: CategoriaGasto;
  timestamp: Date;
  notas?: string;
}

export interface Visita {
  id: string;
  timestamp: Date;
}

export type Role = 'admin' | 'empleado' | 'inactivo';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  role: Role;
}
