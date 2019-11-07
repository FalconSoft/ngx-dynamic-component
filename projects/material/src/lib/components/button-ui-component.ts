import { Component } from '@angular/core';
import { BaseUIComponent, propDescription, StyleProperties, ComponentExample,
  ComponentDescriptor, UIModel, Categories} from '@ngx-dynamic-components/core';
import { packageName } from '../constants';

@Component({
    selector: 'dc-ui-button',
    template: `
    <button mat-flat-button color="primary"
      [ngStyle]="itemStyles"
      (click)="onClick()">
    {{uiModel.itemProperties?.label}}
    </button>
    `
})
export class ButtonUIComponent extends BaseUIComponent<ButtonProperties> {
  onClick() {
    this.interpreter.evaluate(this.scripts, {
      dataModel: this.dataModel,
      uiModel: this.uiModel
    }, this.properties.clickActionKey);
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
}

const example: ComponentExample<UIModel<ButtonProperties>> = {
  title: 'Basic button example',
  uiModel: {
    type: 'material:button',
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
  label: 'Button (Material)',
  packageName,
  category: Categories.Basic,
  description: 'Button component',
  itemProperties: ButtonProperties,
  component: ButtonUIComponent,
  example,
  defaultModel: {
    type: `${packageName}:button`,
    itemProperties: {
      label: 'Button'
    },
    containerProperties: {}
  }
};


