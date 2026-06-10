import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IDynamicDataCallables } from '@microsoft/sp-dynamic-data';
import { Filtro, IFiltroProps } from './components/Filtro';
import { IFilterCriteria } from '../../models/IFilterCriteria';
import { getPropertyDefinitions, getPropertyValue } from '../../sources';
import { DYNAMIC_PROPERTY_IDS } from '../../constants';
export default class FiltroWebPart extends BaseClientSideWebPart<{}> implements IDynamicDataCallables {
  private _filterCriteria: IFilterCriteria = { categories: [], inStock: undefined };

  protected onInit(): Promise<void> {
    if (this.context.dynamicDataSourceManager) {
      this.context.dynamicDataSourceManager.initializeSource(this);
    }
    return Promise.resolve();
  }

  public getPropertyDefinitions() {
    return getPropertyDefinitions();
  }

  public getPropertyValue(propertyId: string): unknown {
    return getPropertyValue(propertyId, { filterCriteria: this._filterCriteria });
  }

  private _onFilterChanged = (criteria: IFilterCriteria): void => {
    this._filterCriteria = criteria;
    this.context.dynamicDataSourceManager.notifyPropertyChanged(DYNAMIC_PROPERTY_IDS.FILTER_CRITERIA);
  };

  public render(): void {
    const element: React.ReactElement<IFiltroProps> = React.createElement(Filtro, {
      serviceScope: this.context.serviceScope,
      onFilterChanged: this._onFilterChanged,
    });
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
