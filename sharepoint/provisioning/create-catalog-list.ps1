# PnP PowerShell script to create the Productos list
param(
    [string]$SiteUrl = "https://tenant.sharepoint.com/sites/yoursite"
)

Connect-PnPOnline -Url $SiteUrl -Interactive

$listName = "Productos"

# Check if list exists
$list = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
if ($list) {
    Write-Host "List '$listName' already exists."
} else {
    New-PnPList -Title $listName -Template GenericList
    Write-Host "List '$listName' created."
}

# Add columns
Set-PnPField -List $listName -Identity "Title" -Values @{Title="Nombre"}
Add-PnPField -List $listName -DisplayName "Categoria" -InternalName "categoria" -Type Choice -Choices "Electrónica","Ropa","Hogar","Deportes","Alimentos" -AddToDefaultView
Add-PnPField -List $listName -DisplayName "Precio" -InternalName "precio" -Type Number -AddToDefaultView
Add-PnPField -List $listName -DisplayName "In Stock" -InternalName "inStock" -Type Boolean -AddToDefaultView
Add-PnPField -List $listName -DisplayName "Descripcion" -InternalName "descripcion" -Type Note -AddToDefaultView

# Add test items
$testItems = @(
    @{Nombre="Laptop Pro"; Categoria="Electrónica"; Precio=1200; inStock=$true; Descripcion="Laptop de alto rendimiento para profesionales"},
    @{Nombre="Camiseta Running"; Categoria="Deportes"; Precio=45; inStock=$true; Descripcion="Camiseta transpirable para correr"},
    @{Nombre="Sofá 3 plazas"; Categoria="Hogar"; Precio=850; inStock=$false; Descripcion="Sofá confortable para sala de estar"},
    @{Nombre="Arroz Integral"; Categoria="Alimentos"; Precio=3.50; inStock=$true; Descripcion="Arroz integral orgánico 1kg"},
    @{Nombre="Jeans Classic"; Categoria="Ropa"; Precio=65; inStock=$true; Descripcion="Jeans de corte clásico"}
)

foreach ($item in $testItems) {
    Add-PnPListItem -List $listName -Values @{
        Title = $item.Nombre
        categoria = $item.Categoria
        precio = $item.Precio
        inStock = $item.inStock
        descripcion = $item.Descripcion
    } | Out-Null
}

Write-Host "Test items added to '$listName'."
Write-Host "Done!"
