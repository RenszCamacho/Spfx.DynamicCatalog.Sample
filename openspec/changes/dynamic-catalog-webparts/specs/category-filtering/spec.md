# category-filtering Specification

## Purpose

Multi-select category filter UI driven by a SharePoint list choice column. Categories are never hardcoded. The filter emits a contract that downstream webparts consume.

## Requirements

### Requirement: Dynamic Category Extraction

FiltroWebPart MUST call CatalogService.getCategories() to obtain categories from the list's choice column definition. No category values SHALL be hardcoded.

#### Scenario: Categories render from list metadata

- GIVEN the SharePoint list's "categoria" choice column has values ["Electrónica", "Hogar", "Deportes"]
- WHEN FiltroWebPart loads
- THEN the filter UI renders exactly those three categories as selectable options

#### Scenario: Categories change with list metadata

- GIVEN the choice column values are updated to ["Electrónica", "Hogar", "Deportes", "Juguetes"]
- WHEN FiltroWebPart reloads
- THEN "Juguetes" appears in the filter UI without code changes

### Requirement: Multi-Select Filter UI

The filter SHALL present categories as a multi-select UI (checkboxes or toggle buttons). All categories MUST be deselectable; deselecting all means "no filter applied."

#### Scenario: Select multiple categories

- GIVEN categories ["Electrónica", "Hogar", "Deportes"]
- WHEN the user selects "Electrónica" and "Hogar"
- THEN both are marked as selected AND the filter emits `{ categories: ["Electrónica", "Hogar"] }`

#### Scenario: Deselect all categories

- GIVEN "Electrónica" is currently selected
- WHEN the user deselects it
- THEN the filter emits `{ categories: [] }` (all products shown)

### Requirement: Stock Toggle

A stock toggle SHALL filter by inStock boolean. The filter contract MUST support `{ categories?: string[], inStock?: boolean }`.

#### Scenario: Stock toggle enabled

- GIVEN products exist with mixed inStock values
- WHEN the user enables the stock toggle
- THEN the filter emits `{ inStock: true }` AND only in-stock products are shown

### Requirement: Filter Criteria Contract

The filter SHALL emit an IFilterCriteria object: `{ categories?: string[], inStock?: boolean }`. This contract is exposed via SPFx Dynamic Data.

### Requirement: Auto-Clear Selection on Filter Change

When active filters change, if the currently selected product no longer matches, it MUST be automatically cleared.

#### Scenario: Selected product falls outside filter

- GIVEN product "X" in category "Hogar" is selected
- WHEN the user deselects "Hogar" from the filter
- THEN product "X" is deselected AND the selection is cleared to undefined
