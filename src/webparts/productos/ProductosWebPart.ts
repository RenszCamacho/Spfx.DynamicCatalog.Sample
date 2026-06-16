import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  PropertyPaneTextField,
  PropertyPaneDynamicField,
  type IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import type { IDynamicDataCallables } from '@microsoft/sp-dynamic-data';
import type { DynamicProperty } from '@microsoft/sp-component-base';
import type { IProduct } from '../../models/IProduct';
import type { IFilterCriteria } from '../../models/IFilterCriteria';
import { getPropertyDefinitions, getPropertyValue } from '../../sources';
import { DYNAMIC_PROPERTY_IDS } from '../../constants';
import { ProductosList } from './components/ProductosList';

export interface IProductosWebPartProps {
  listName: string;
  filterCriteria: DynamicProperty<IFilterCriteria>;
}

export default class ProductosWebPart
  extends BaseClientSideWebPart<IProductosWebPartProps>
  implements IDynamicDataCallables
{
  private _selectedProduct: IProduct | undefined;

  protected onInit(): Promise<void> {
    this.context.dynamicDataSourceManager.initializeSource(this);
    return super.onInit();
  }

  public getPropertyDefinitions = (): ReturnType<typeof getPropertyDefinitions> =>
    getPropertyDefinitions();

  public getPropertyValue = (propertyId: string): unknown =>
    getPropertyValue(propertyId, { selectedProduct: this._selectedProduct });

  private _onProductSelected = (product: IProduct | undefined): void => {
    this._selectedProduct = product;
    this.context.dynamicDataSourceManager.notifyPropertyChanged(
      DYNAMIC_PROPERTY_IDS.SELECTED_PRODUCT
    );
  };

  public render(): void {
    ReactDom.render(
      React.createElement(ProductosList, {
        serviceScope: this.context.serviceScope,
        dynamicPropertyValue: this.properties.filterCriteria,
        onProductSelected: this._onProductSelected,
      }),
      this.domElement
    );
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('2.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'Product Catalog Settings' },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: 'SharePoint List Name',
                  value: 'Productos',
                }),
                PropertyPaneDynamicField('filterCriteria', {
                  label: 'Filter Data Source',
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
