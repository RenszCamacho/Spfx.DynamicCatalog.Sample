import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  PropertyPaneDynamicField,
  type IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import type { DynamicProperty } from '@microsoft/sp-component-base';
import { DetallesWrapper } from './components/DetallesWrapper';
import type { IProduct } from '../../models/IProduct';

export interface IDetallesWebPartProps {
  selectedProduct: DynamicProperty<IProduct>;
}

export default class DetallesWebPart extends BaseClientSideWebPart<IDetallesWebPartProps> {
  public render(): void {
    ReactDom.render(
      React.createElement(DetallesWrapper, { product: this.properties.selectedProduct }),
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
      pages: [{
        header: { description: 'Detalles Web Part Settings' },
        groups: [{
          groupFields: [
            PropertyPaneDynamicField('selectedProduct', {
              label: 'Product Data Source',
            }),
          ],
        }],
      }],
    };
  }
}
