import { Component } from '@angular/core';
import { LabelProperties, ComponentDescriptor, LabeledComponent,
  UIModel, ComponentExample, propDescription, Categories } from '@ngx-dynamic-components/core';
import { packageName } from '../../constants';

@Component({
  selector: 'dc-select-ui',
  template: `
    <div class="form-group mb-0" [fxLayout]="layout" [ngStyle]="itemStyles">
      <label selected *ngIf="hasLabel" [for]="id" [class]="properties.labelPosition"
      [fxFlex]="layout === 'row' ? properties.labelWidth : false">{{properties.label}}</label>
      <ng-select [items]="properties.options" (change)="onSelect()"
      [(ngModel)]="componentDataModel" [attr.disabled]="disabled"></ng-select>
    </div>`,
  styleUrls: ['../../styles/label.scss']
})

export class SelectUIComponent extends LabeledComponent<SelectProperties> {
  onSelect() {
    this.changedDataModel.emit(this.dataModel);
    this.triggerAction('_selectionChanged');
  }

  get disabled() {
    const options = this.properties.options;
    return options && options.length ? null : 'disabled';
  }
}

export class SelectProperties extends LabelProperties {
  @propDescription({
    description: 'Select options.',
    example: '[{label: "One", value: 1}]',
  })
  options: { label: string, value: string | number }[];

  @propDescription({
    description: 'Label shown when no option is selected.',
    example: 'Please select an option',
  })
  label: string;
}

interface SelectUIComponentConstrutor {
  new (): SelectUIComponent;
}

interface SelectPropertiesConstrutor {
  new (): SelectProperties;
}

export const example: ComponentExample<UIModel<SelectProperties>> = {
  uiModel: {
    type: `${packageName}:select`,
    containerProperties: {},
    id: 'stateSelection',
    itemProperties: {
      options: [
        {label: 'United Kingdom', value: 'uk'},
        {label: 'Ukraine', value: 'ua'}
      ],
      label: 'Country',
      dataModelPath: '$.country'
    }
  },
  dataModel: {},
  title: 'Basic select example'
};

export const selectDescriptor: ComponentDescriptor<SelectUIComponentConstrutor, SelectPropertiesConstrutor> = {
  name: 'select',
  label: 'UI Select Input',
  packageName,
  category: Categories.Basic,
  description: 'Select component',
  itemProperties: SelectProperties,
  component: SelectUIComponent,
  example,
  defaultModel: {
    type: `${packageName}:select`,
    containerProperties: {},
    itemProperties: {
      options: [
        {label: 'First option', value: '1'},
        {label: 'Second option', value: '2'}
      ],
      width: '200px',
      label: 'Select option',
      dataModelPath: '$.option'
    }
  }
};
