export interface IProduct {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  inStock: boolean;
  descripcion: string;
}

export interface IProductResponse {
  Id: number;
  Title?: string;
  nombre?: string;
  categoria?: string;
  precio?: number;
  inStock?: boolean;
  descripcion?: string;
}
