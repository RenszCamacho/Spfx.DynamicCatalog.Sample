# webpart-interop Specification

## Purpose

SPFx Dynamic Data communication contracts between FiltroWebPart, ProductosWebPart, and DetallesWebPart. Defines property IDs, source/consumer registration, and the data flow pipeline.

## Requirements

### Requirement: Dynamic Data Source Registration

Each source webpart MUST call DynamicDataSourceManager.initializeSource() in onInit() and implement IDynamicDataCallables.

### Requirement: Filter Source Contract

FiltroWebPart SHALL implement IDynamicDataCallables and provide property `"filterCriteria"` of type IFilterCriteria (`{ categories?: string[], inStock?: boolean }`).

#### Scenario: FiltroWebPart exposes filter criteria

- GIVEN FiltroWebPart is connected and the user selects "Electrónica"
- WHEN another webpart reads `filterCriteria`
- THEN it receives `{ categories: ["Electrónica"] }`

### Requirement: Product Consumer Contract

ProductosWebPart SHALL consume filterCriteria via DynamicProperty<IFilterCriteria> and SHALL provide property `"selectedProduct"` of type IProduct via IDynamicDataCallables.

#### Scenario: ProductosWebPart consumes filter

- GIVEN FiltroWebPart emits `{ categories: ["Hogar"] }`
- WHEN ProductosWebPart receives the filter
- THEN it queries only "Hogar" products

#### Scenario: ProductosWebPart exposes selection

- GIVEN the user clicks product "Lampara LED" (id=5)
- WHEN Dynamic Data reads `selectedProduct`
- THEN it receives `{ id: 5, nombre: "Lampara LED", categoria: "Hogar", ... }`

### Requirement: Detail Consumer Contract

DetallesWebPart SHALL consume selectedProduct via DynamicProperty<IProduct> and SHALL NOT register as a source.

### Requirement: Property IDs as Constants

All Dynamic Data property IDs MUST be defined as constants using `as const` in `src/constants/index.ts`:

```
filterCriteria = "filterCriteria" as const
selectedProduct = "selectedProduct" as const
```

#### Scenario: Property ID reuse across webparts

- GIVEN FiltroWebPart registers source with `propertyId: filterCriteria`
- WHEN ProductosWebPart configures consumer with `propertyId: filterCriteria`
- THEN both references resolve to the same constant — zero magic strings

### Requirement: Pure Helpers

`src/sources/index.ts` SHALL export pure functions `getPropertyDefinitions()` and `getPropertyValue()` with zero side effects.

### Requirement: Data Version

Dynamic Data SHALL use version 2.* (modern API). `notifyPropertyChanged()` MUST fire only on selection change, not on every list load.

#### Scenario: No spurious notifications on list load

- GIVEN ProductosWebPart loads 10 products after a filter change
- WHEN no product is selected or the selection is unchanged
- THEN `notifyPropertyChanged()` is NOT called

#### Scenario: Notification on selection change

- GIVEN the user clicks a different product
- WHEN the selection changes from product A to product B
- THEN `notifyPropertyChanged("selectedProduct")` is called exactly once
