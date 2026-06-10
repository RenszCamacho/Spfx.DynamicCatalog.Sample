# Proposal: Dynamic Product Catalog Webparts

## Intent
Build three SPFx Dynamic Data-connected webparts (Filtro, Productos, Detalles) that render a product catalog from a SharePoint list. Categories come from the list's choice column — never hardcoded. Users multi-select categories to filter products and click to see details.

## Scope

### In Scope
- FiltroWebPart: reads categories dynamically, multi-select filter buttons, SPFx Dynamic Data source
- ProductosWebPart: `PropertyPaneTextField("listName")`, consumes filter data, displays matching products
- DetallesWebPart: consumes selected product via Dynamic Data, shows details or placeholder
- PnPjs v4 `CatalogService` with ServiceScope DI + ServiceKey
- Full state coverage: disconnected (`MessageBar`), empty results, no-selection placeholder, PnPjs errors
- Auto-clear selected product when it falls outside filtered category set
- List provisioning script: columns nombre (Text), categoria (Choice), precio (Number), inStock (Yes/No), descripcion (Note)

### Out of Scope
- CRUD, search, sort, pagination — read-only catalog
- Real product data — test data only

## Capabilities

### New Capabilities
- `catalog-data-service`: PnPjs v4 with ServiceScope DI — read products, categories, handle errors
- `category-filtering`: Dynamic choice-column extraction, multi-select UI, filtered-result contract
- `webpart-interop`: SPFx Dynamic Data source/consumer contracts across all three webparts
- `catalog-ux`: Empty, disconnected, placeholder, error states via FluentUI

### Modified Capabilities
None — greenfield. Existing boilerplate FiltersWebPart reimplemented.

## Approach
1. Add `@pnp/sp`, create `CatalogService` (`ServiceKey.create` + `spfi().using(SPFx({pageContext}))`)
2. FiltroWebPart → reads categories → exposes selections as Dynamic Data source
3. ProductosWebPart → consumes filter → queries list → exposes selected product as source
4. DetallesWebPart → consumes product → renders details or placeholder
5. Provisioning script creates list at site collection root

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | `@pnp/sp` dependency |
| `src/services/CatalogService.ts` | New | PnPjs v4 data access, ServiceKey DI |
| `src/webparts/filtro/` | Modified | Dynamic Data source, category filter UI |
| `src/webparts/productos/` | New | Product list, Dynamic Data consumer |
| `src/webparts/detalles/` | New | Product detail, Dynamic Data consumer |
| `src/components/shared/` | New | Empty/error/placeholder components |
| `sharepoint/provisioning/` | New | List creation script |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Schema mismatch with final client list | Medium | Script isolated + documented; client provides final schema |
| Dynamic Data breakage with multiple webpart instances | Low | Source ID isolation; test 3+ instances |

## Rollback Plan
Remove webparts from manifest, delete source folders, revert `@pnp/sp` from package.json. Git revert restores boilerplate.

## Dependencies
- `@pnp/sp` npm package
- Provisioned SharePoint list (created by included script)

## Success Criteria
- [ ] Categories render from choice column values (no hardcoded labels)
- [ ] Multi-select filtering works; deselecting all shows every product
- [ ] Selected product clears when it exits filtered set
- [ ] DetallesWebPart shows placeholder ("Seleccioná un producto para ver sus detalles") when nothing selected
- [ ] Disconnected state: "No está conectado a una lista de productos"
- [ ] Empty results: "No se encontraron productos"
- [ ] Errors: PnPjs/permission failures shown via FluentUI MessageBar
- [ ] Provisioning script creates list with correct schema
