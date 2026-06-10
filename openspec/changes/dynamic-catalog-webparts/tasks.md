# Tasks: Dynamic Product Catalog Webparts

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 1000–1200 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Foundation: constants, models, CatalogService, sources | PR 1 | ~280 lines; independent deliverable |
| 2 | Shared components + FiltroWebPart (rework) | PR 2 | ~330 lines; depends on PR 1 |
| 3 | ProductosWebPart (new) | PR 3 | ~280 lines; depends on PR 2 |
| 4 | DetallesWebPart + provisioning + cleanup | PR 4 | ~290 lines; depends on PR 3 |

## Phase 1: Foundation — Constants, Models & Services

- [ ] 1.1 Install `@pnp/sp` and `@pnp/logging`: `npm install @pnp/sp @pnp/logging`
- [x] 1.2 Create `src/constants/index.ts` — list column names, `DYNAMIC_PROPERTY_IDS` (`filterCriteria`, `selectedProduct`), error messages, all `as const`
- [x] 1.3 Create `src/models/IProduct.ts`, `src/models/IFilterCriteria.ts`, `src/models/index.ts` — domain interfaces with barrel export
- [x] 1.4 Create `src/services/ICatalogService.ts` — `getProducts(filter?): Promise<IProduct[]>`, `getCategories(): Promise<string[]>`
- [x] 1.5 Create `src/services/CatalogService.ts` — `ServiceKey.create` with PnPjs `spfi().using(SPFx({pageContext})).using(PnPLogging(...))`, try/catch returning `[]` on error with exposed `lastError`
- [x] 1.6 Create `src/sources/index.ts` — pure `getPropertyDefinitions()` and `getPropertyValue()` functions for Dynamic Data sources

## Phase 2: Shared Components + FiltroWebPart

- [ ] 2.1 Create `src/components/shared/EmptyState.tsx` — "No se encontraron productos" message
- [ ] 2.2 Create `src/components/shared/Placeholder.tsx` — "Seleccioná un producto para ver sus detalles" placeholder
- [ ] 2.3 Create `src/components/shared/ErrorMessage.tsx` — FluentUI `MessageBar` wrapper (`messageBarType={MessageBarType.error}`)
- [ ] 2.4 Rework `src/webparts/filtro/` — `FiltroWebPart.ts` implements `IDynamicDataCallables`, registers Dynamic Data source, exposes `filterCriteria`
- [ ] 2.5 Create `src/webparts/filtro/hooks/useFiltro.ts` — fetch categories from `CatalogService`, manage multi-select state, emit `IFilterCriteria`
- [ ] 2.6 Create `src/webparts/filtro/components/Filtro.tsx` — category toggle buttons, stock toggle, disconnected `MessageBar`

## Phase 3: ProductosWebPart (New)

- [ ] 3.1 Create `src/webparts/productos/ProductosWebPart.manifest.json` — new manifest with dynamic data metadata
- [ ] 3.2 Create `src/webparts/productos/ProductosWebPart.ts` — consumer of `filterCriteria` (DynamicProperty), provider of `selectedProduct` (IDynamicDataCallables), `PropertyPaneTextField("listName")`, `serviceScope.provide(...)` for CatalogService
- [ ] 3.3 Create `src/webparts/productos/hooks/useProductos.ts` — consume filter via DynamicProperty, fetch products, manage `Selection`, auto-clear when selected product leaves filtered set
- [ ] 3.4 Create `src/webparts/productos/components/ProductosList.tsx` — `DetailsList` with `Selection`, empty/loading/error states via shared components

## Phase 4: DetallesWebPart + Provisioning + Cleanup

- [ ] 4.1 Create `src/webparts/detalles/DetallesWebPart.manifest.json` — consumer-only manifest
- [ ] 4.2 Create `src/webparts/detalles/DetallesWebPart.ts` — consumer of `selectedProduct` (DynamicProperty), no source registration
- [ ] 4.3 Create `src/webparts/detalles/hooks/useDetalles.ts` — subscribe to DynamicProperty, handle `null`/`undefined` for placeholder
- [ ] 4.4 Create `src/webparts/detalles/components/DetallesProducto.tsx` — `DocumentCard` showing nombre, categoria, precio, inStock, descripcion; `Placeholder` when no selection
- [ ] 4.5 Create `sharepoint/provisioning/create-catalog-list.ps1` — PnP PowerShell script creating "Productos" list with columns: nombre (Text), categoria (Choice), precio (Number), inStock (Yes/No), descripcion (Note)
- [ ] 4.6 Update `config/config.json` — add three new webpart bundle entries, remove `filters` bundle
- [ ] 4.7 Delete `src/webparts/filters/` — remove boilerplate FiltersWebPart directory
- [ ] 4.8 Verify: run `npm run build` (or project equivalent), confirm zero build errors
