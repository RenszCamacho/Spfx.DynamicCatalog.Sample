# catalog-data-service Specification

## Purpose

Data-access layer using PnPjs v4 with ServiceScope DI. Reads product and category data from a SharePoint list, mapping SharePoint field types to domain models.

## Requirements

### Requirement: Service Registration

CatalogService MUST be registered via ServiceKey.create and consumed through ServiceScope.whenFinished.

**Constraints**: No static singletons. No WebPartContext injection.

### Requirement: Data Access Layer

The service SHALL initialize PnPjs v4 using `spfi().using(SPFx({ pageContext })).using(PnPLogging(...))` and MUST expose two public methods:

| Method | Signature | Behavior |
|--------|-----------|----------|
| getProducts | `(filterCriteria?): Promise<IProduct[]>` | Reads list items, maps to domain model |
| getCategories | `(): Promise<string[]>` | Reads from choice column definition |

### Requirement: Product Querying

getProducts(filterCriteria?) SHALL query the configured SharePoint list and return an IProduct[] array.

#### Scenario: Fetch all products (no filter)

- GIVEN a provisioned list with products
- WHEN `getProducts()` is called without arguments
- THEN all list items are returned as IProduct objects

#### Scenario: Filter by category

- GIVEN products across multiple categories
- WHEN `getProducts({ categories: ["Electrónica", "Hogar"] })` is called
- THEN only products matching those categories are returned

#### Scenario: Filter by stock status

- GIVEN products with mixed inStock values
- WHEN `getProducts({ inStock: true })` is called
- THEN only products with inStock=true are returned

### Requirement: Category Extraction

getCategories() MUST read the SharePoint list's choice column definition dynamically — never from hardcoded values.

#### Scenario: Read choice column values

- GIVEN a list with a "categoria" Choice column containing "Electrónica", "Hogar", "Deportes"
- WHEN `getCategories()` is called
- THEN `["Electrónica", "Hogar", "Deportes"]` is returned

### Requirement: Domain Model

IProduct SHALL use interface typing with these fields:

| Field | Type | Source |
|-------|------|--------|
| id | number | List item ID |
| nombre | string | nombre (Text) |
| categoria | string | categoria (Choice) |
| precio | number | precio (Number) |
| inStock | boolean | inStock (Yes/No) |
| descripcion | string | descripcion (Note) |

IProductResponse (internal) maps raw SharePoint fields; mapping MUST happen inside the service.

### Requirement: Error Handling

On PnPjs or permission failures, the service SHALL return an empty array and expose the error for UI consumption.

#### Scenario: Permission failure

- GIVEN the user lacks read access to the list
- WHEN `getProducts()` is called
- THEN an empty array `[]` is returned AND the error is surfaced for UI display

#### Scenario: List not found

- GIVEN the configured list does not exist
- WHEN `getProducts()` is called
- THEN an empty array `[]` is returned AND the error is surfaced for UI display
