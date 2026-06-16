# catalog-ux Specification

## Purpose

User-facing states and UI behavior for all three webparts. Covers disconnected, empty, placeholder, loading, and error states using FluentUI components and SCSS theming.

## Requirements

### Requirement: FiltroWebPart States

#### Scenario: Disconnected state

- GIVEN FiltroWebPart is on a page with no product list connected
- WHEN the webpart renders
- THEN a MessageBar warning displays: "No está conectado a una lista de productos"

### Requirement: ProductosWebPart States

#### Scenario: Empty results state

- GIVEN no products match the current filter criteria
- WHEN ProductosWebPart renders
- THEN an empty-state component displays: "No se encontraron productos"

#### Scenario: Loading state

- GIVEN ProductosWebPart initiates a data fetch
- WHEN the request is in flight
- THEN a FluentUI Spinner is displayed

### Requirement: DetallesWebPart States

#### Scenario: No-selection placeholder

- GIVEN DetallesWebPart is connected but no product is selected
- WHEN the webpart renders
- THEN a placeholder displays: "Seleccioná un producto para ver sus detalles"

#### Scenario: Product selected — details shown

- GIVEN a product is selected
- WHEN DetallesWebPart renders
- THEN the product's nombre, categoria, precio, inStock, and descripcion are displayed

### Requirement: Error Display

PnPjs and permission errors SHALL render via FluentUI MessageBar with `messageBarType={MessageBarType.error}`.

#### Scenario: Permission error

- GIVEN the user lacks list read permissions
- WHEN any webpart's data fetch fails
- THEN a FluentUI error MessageBar displays the error details

#### Scenario: Network failure

- GIVEN a PnPjs request fails due to network error
- WHEN any webpart's data fetch fails
- THEN a FluentUI error MessageBar displays the error

### Requirement: Product Display Layout

ProductosWebPart SHALL render products using a FluentUI DetailsList or DocumentCard grid layout. Components MUST be functional with custom hooks and named exports.

### Requirement: Styling Integration

SCSS modules SHALL use FluentUI theme tokens via `[theme:themePrimary, default:#0078d4]` syntax and CSS custom properties with `var(--...)` for dynamic theming.

### Requirement: Component Architecture

All components SHALL be functional components with React.FC typing. Named exports only — no default exports. Custom hooks SHALL encapsulate data-fetching and state logic.
