import type { IProduct, IProductResponse } from '../models/IProduct';

export const mapToProduct = (item: IProductResponse): IProduct => ({
  id: item.Id,
  nombre: item.nombre ?? item.Title ?? '',
  categoria: item.categoria ?? '',
  precio: item.precio ?? 0,
  inStock: Boolean(item.inStock),
  descripcion: item.descripcion ?? '',
});

export const mapToProducts = (items: IProductResponse[]): IProduct[] =>
  items.map(mapToProduct);
