# Design: Dynamic Product Catalog Webparts

## Technical Approach

Three SPFx Dynamic Data-connected webparts implementing a read-only product catalog. PnPjs v4 `CatalogService` reads from a SharePoint list via ServiceScope DI. `FiltroWebPart` provides `filterCriteria`, `ProductosWebPart` consumes it and provides `selectedProduct`, `DetallesWebPart` consumes `selectedProduct`. All components are functional with named exports.

## Architecture Decisions

| Decision | Choice | Rejected | Rationale |
|----------|--------|----------|-----------|
| Data access | PnPjs v4 `spfi().using(SPFx({pageContext}))` | SPHttpClient, @pnp/sp v3 | PnPjs v4 provides batching, caching, logging; matches spfx-pnpjs skill contract |
| DI pattern | `ServiceKey.create` + `serviceScope.consume()` | Static singleton, WebPartContext injection | Matches spfx-di-servicescope skill — no static state, testable |
| Component model | Functional components + hooks (`React.FC`) | Class components | User pattern mandate; better with React 17 hooks |
| Exports | Named exports only | Default exports | User pattern mandate; explicit imports more discoverable |
| Category source | PnPjs `fields.select("Choices")` from choice column | Hardcoded array, REST `fieldValuesAsText` | Read directly from column definition — zero maintenance on category changes |
| Auto-clear selection | Filter change triggers re-query; if selectedId ∉ results, clear | Keep stale selection | Prevents showing details for a product not in current filter set |

## Data Flow

```
SharePoint List (Productos)
      │ PnPjs v4: spfi().using(SPFx({pageContext}))
      ▼
CatalogService (ServiceScope DI, ServiceKey)
      │ getProducts(filter?) → IProduct[]
      │ getCategories() → string[]
      ▼
ProductosWebPart ────consumes────▶ filterCriteria (Dynamic Data) ◀────provides──── FiltroWebPart
      │                                                                          │
      │ provides (Dynamic Data)                                                  │ CatalogService.getCategories()
      ▼                                                                          │
selectedProduct                                                                CategoryButton[] + StockToggle
      │
      │ consumes (Dynamic Data)
      ▼
DetallesWebPart (conditional render)
```

### Filter → Products → Details Pipeline

1. **FiltroWebPart** calls `CatalogService.getCategories()` → renders buttons. User selection builds `IFilterCriteria` → `notifyPropertyChanged("filterCriteria")`.
2. **ProductosWebPart** receives `IFilterCriteria` via `DynamicProperty` → calls `CatalogService.getProducts(criteria)` → renders `DetailsList`.
3. On row selection, `notifyPropertyChanged("selectedProduct", product)` fires.
4. **DetallesWebPart** receives `IProduct | undefined` via `DynamicProperty` → conditional render.

### Selection Auto-Clear

When `filterCriteria` changes, `useProductos` re-fetches. If `selectedProduct.id` is absent from the new result set, the hook sets selection to `undefined` and calls `notifyPropertyChanged("selectedProduct", undefined)`.

## Dynamic Data Contract

```typescript
// src/constants/index.ts
export const DYNAMIC_PROPERTY_IDS = {
  FILTER_CRITERIA: 'filterCriteria',
  SELECTED_PRODUCT: 'selectedProduct',
} as const;
```

| Property ID | Type | Provider | Consumer |
|-------------|------|----------|----------|
| `filterCriteria` | `IFilterCriteria` | FiltroWebPart | ProductosWebPart |
| `selectedProduct` | `IProduct \| undefined` | ProductosWebPart | DetallesWebPart |

```typescript
interface IFilterCriteria {
  categories: string[];        // empty = no category filter
  inStock: boolean | undefined; // undefined = no stock filter
}

interface IProduct {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  inStock: boolean;
  descripcion: string;
}
```

## Service Design

```typescript
interface ICatalogService {
  getProducts(filter?: IFilterCriteria): Promise<IProduct[]>;
  getCategories(): Promise<string[]>;
}
```

`CatalogService` implements `ICatalogService`:
- **Registration**: WebPart calls `serviceScope.provide(CatalogService.serviceKey, (sc) => new CatalogService(sc, listName))` in `onInit()`.
- **getProducts**: `this._sp.web.lists.getByTitle(this._listName).items.filter(...)`. Builds OData filter string from `IFilterCriteria` — `categoria eq 'X' or categoria eq 'Y'` and optionally `inStock eq 1`.
- **getCategories**: `this._sp.web.lists.getByTitle(this._listName).fields.getByInternalNameOrTitle("categoria").select("Choices")()` → maps to `string[]`.
- **Errors**: Wrapped in try/catch → returns `[]` and stores error for hook consumption.
- **Re-registration**: On `listName` property change via PropertyPane, re-call `serviceScope.provide(...)`.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add `@pnp/sp` dependency |
| `src/constants/index.ts` | Create | Dynamic Data property IDs, list column names, error messages |
| `src/models/IProduct.ts` | Create | Domain model interface |
| `src/models/IFilterCriteria.ts` | Create | Filter criteria contract |
| `src/models/index.ts` | Create | Barrel export |
| `src/services/ICatalogService.ts` | Create | Service interface contract |
| `src/services/CatalogService.ts` | Create | PnPjs v4 implementation with ServiceKey |
| `src/sources/index.ts` | Create | Pure `getPropertyDefinitions`/`getPropertyValue` for DynamicData |
| `src/components/shared/EmptyState.tsx` | Create | Reusable empty results component |
| `src/components/shared/Placeholder.tsx` | Create | Reusable no-selection placeholder |
| `src/components/shared/ErrorMessage.tsx` | Create | Reusable MessageBar error wrapper |
| `src/webparts/filtro/FiltroWebPart.ts` | Create | IDynamicDataCallables provider for filterCriteria |
| `src/webparts/filtro/FiltroWebPart.manifest.json` | Create | Manifest |
| `src/webparts/filtro/components/Filtro.tsx` | Create | Category buttons + stock toggle UI |
| `src/webparts/filtro/components/IFiltroProps.ts` | Create | Props interface |
| `src/webparts/filtro/components/Filtro.module.scss` | Create | Styles |
| `src/webparts/filtro/hooks/useFiltro.ts` | Create | Category fetching + selection state |
| `src/webparts/productos/ProductosWebPart.ts` | Create | Consumer (filter) + provider (selection) |
| `src/webparts/productos/ProductosWebPart.manifest.json` | Create | Manifest |
| `src/webparts/productos/components/ProductosList.tsx` | Create | DetailsList with selection |
| `src/webparts/productos/components/IProductosListProps.ts` | Create | Props interface |
| `src/webparts/productos/components/Productos.module.scss` | Create | Styles |
| `src/webparts/productos/hooks/useProductos.ts` | Create | Product fetching + selection management |
| `src/webparts/detalles/DetallesWebPart.ts` | Create | Consumer only |
| `src/webparts/detalles/DetallesWebPart.manifest.json` | Create | Manifest |
| `src/webparts/detalles/components/DetallesProducto.tsx` | Create | DocumentCard detail view |
| `src/webparts/detalles/components/IDetallesProductoProps.ts` | Create | Props interface |
| `src/webparts/detalles/components/Detalles.module.scss` | Create | Styles |
| `src/webparts/detalles/hooks/useDetalles.ts` | Create | Dynamic Data subscription hook |
| `src/webparts/filters/` | Delete | Remove boilerplate FiltersWebPart |
| `config/config.json` | Modify | Add three new webpart bundle entries, remove filters bundle |
| `sharepoint/provisioning/create-catalog-list.ps1` | Create | PnP PowerShell list provisioning |

## Component State Coverage

| WebPart | Disconnected | Empty | Loading | Placeholder | Error | Ready |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| Filtro | ✓ MessageBar | N/A | ✓ Spinner | N/A | ✓ MessageBar | ✓ |
| Productos | N/A | ✓ EmptyState | ✓ Spinner | N/A | ✓ ErrorMessage | ✓ DetailsList |
| Detalles | N/A | N/A | N/A | ✓ Placeholder | ✓ ErrorMessage | ✓ DocumentCard |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `CatalogService` query building, IProduct mapping | Jest + mock PnPjs SPFI |
| Unit | `src/sources/` pure functions | Jest — zero mocks needed |
| Unit | Hooks: `useFiltro`, `useProductos`, `useDetalles` | Jest + React Testing Library |
| Integration | Webpart Dynamic Data wiring | SPFx test harness (workbench) |
| E2E | Three webparts on page, filter → select → details | Manual workbench validation |

## Migration / Rollout

No migration required — greenfield. Boilerplate `FiltersWebPart` is removed. Provisioning script creates the list independently.

## Open Questions

None — all design decisions resolved.
