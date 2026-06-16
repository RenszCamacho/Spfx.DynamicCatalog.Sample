import { ServiceScope } from '@microsoft/sp-core-library';
import { IFilterCriteria } from '../../../models/IFilterCriteria';

export interface IFiltroProps {
  serviceScope: ServiceScope;
  onFilterChanged: (criteria: IFilterCriteria) => void;
}
