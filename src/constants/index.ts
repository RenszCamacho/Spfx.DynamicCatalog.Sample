export const LIST_COLUMNS = {
  NOMBRE: 'nombre',
  CATEGORIA: 'categoria',
  PRECIO: 'precio',
  IN_STOCK: 'inStock',
  DESCRIPCION: 'descripcion',
} as const;

export const DYNAMIC_PROPERTY_IDS = {
  FILTER_CRITERIA: 'filterCriteria',
  SELECTED_PRODUCT: 'selectedProduct',
} as const;

export const UI_MESSAGES = {
  DISCONNECTED: 'No está conectado a una lista de productos',
  NO_RESULTS: 'No se encontraron productos',
  SELECT_PRODUCT: 'Seleccioná un producto para ver sus detalles',
  LIST_NOT_FOUND: 'La lista de SharePoint no existe o no es accesible',
  PERMISSION_ERROR: 'No tenés permisos para acceder a la lista',
  GENERIC_ERROR: 'Ocurrió un error al cargar los datos',
} as const;
