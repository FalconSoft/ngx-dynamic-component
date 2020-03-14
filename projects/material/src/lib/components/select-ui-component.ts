import { Component } from '@angular/core';
import { BaseUIComponent, DataModelProperties, ComponentDescriptor,
  UIModel, ComponentExample, propDescription, Categories } from '@ngx-dynamic-components/core';
import { packageName } from '../constants';

@Component({
  selector: 'dc-ui-select',
  template: `
    <mat-form-field>
      <mat-select [ngStyle]="itemStyles"
        [placeholder]="uiModel.itemProperties?.placeholder"
        (selectionChange)="onSelect()"
        [(ngModel)]="componentDataModel">
        <mat-option *ngFor="let option of uiModel.itemProperties?.options" [value]="option.value">
          {{option.label}}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `
})
export class SelectUIComponent extends BaseUIComponent<SelectProperties> {
  onSelect() {
    this.changedDataModel.emit(this.dataModel);
    this.triggerAction('_selectionChanged');
  }
}

export class SelectProperties extends DataModelProperties {
  @propDescription({
    description: 'Select options.',
    example: '[{label: "One", value: 1}]',
  })
  options: { label: string, value: string | number }[];

  @propDescription({
    description: 'Label shown when no option is selected.',
    example: 'Please select an option',
  })
  placeholder: string;
}

interface SelectUIComponentConstrutor {
  new (): SelectUIComponent;
}

interface SelectPropertiesConstrutor {
  new (): SelectProperties;
}

const example: ComponentExample<UIModel<SelectProperties>> = {
  uiModel: {
    type: 'mat-select',
    containerProperties: {},
    id: 'stateSelection',
    itemProperties: {
      options: [
        {label: 'United Kingdom', value: 'uk'},
        {label: 'Ukraine', value: 'ua'}
      ],
      placeholder: 'Country',
      dataModelPath: '$.country'
    }
  },
  dataModel: {},
  title: 'Basic select example'
};

export const selectDescriptor: ComponentDescriptor<SelectUIComponentConstrutor, SelectPropertiesConstrutor> = {
  name: 'mat-select',
  packageName,
  label: 'Dropdown (Material)',
  category: Categories.Basic,
  description: 'Select component',
  itemProperties: SelectProperties,
  component: SelectUIComponent,
  example
};
