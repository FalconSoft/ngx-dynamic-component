import { Component, HostBinding } from '@angular/core';
import { BaseUIComponent, propDescription, StyleProperties, ComponentExample,
  ComponentDescriptor, UIModel, Categories} from '@ngx-dynamic-components/core';
import { packageName } from '../../constants';

@Component({
  selector: 'dc-button-ui',
  template: `
    <button class="btn " [ngClass]="properties.btnClass || 'btn-primary'"
      [type]="properties.type" [ngStyle]="itemStyles"
      (click)="onClick()">{{properties.label}}</button>
  `
})
export class ButtonUIComponent extends BaseUIComponent<ButtonProperties> {
  onClick() {
    this.workflowEngine.run(this.properties.clickActionKey);
    this.changedDataModel.emit(this.dataModel);
  }
}

export class ButtonProperties extends StyleProperties {
  @propDescription({
    description: 'Button label',
    example: 'Click me!',
  })
  label: string;

  @propDescription({
    description: 'Key for action that fires onclick',
    example: 'submit',
  })
  clickActionKey: string;

  @propDescription({
    description: 'Bootstrap predefined button class',
    example: 'btn-secondary',
  })
  btnClass?: string;

  @propDescription({
    description: 'Button type: button|submit|reset. Default: button',
    example: 'submit',
  })
  type?: string;
}

export const example: ComponentExample<UIModel<ButtonProperties>> = {
  title: 'Basic button example',
  uiModel: {
    type: `${packageName}:button`,
    containerProperties: {},
    itemProperties: {
      label: 'SUBMIT',
      width: '50%',
      margin: '15px',
      padding: '10px 5px 10px 0px',
      clickActionKey: 'consoleLog'
    }
  },
  dataModel: {}
};

interface ButtonUIComponentConstrutor {
  new (): ButtonUIComponent;
}

interface ButtonPropertiesConstrutor {
  new (): ButtonProperties;
}

export const buttonDescriptor: ComponentDescriptor<ButtonUIComponentConstrutor, ButtonPropertiesConstrutor> = {
  name: 'button',
  label: 'Button',
  packageName,
  category: Categories.Basic,
  description: 'Button component',
  itemProperties: ButtonProperties,
  component: ButtonUIComponent,
  example,
  defaultModel: {
    type: `${packageName}:button`,
    containerProperties: {},
    itemProperties: {
      label: 'Label',
      clickActionKey: 'consoleLog'
    }
  }
};
