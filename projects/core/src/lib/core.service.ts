import { Injectable } from '@angular/core';

import { ComponentDescriptor } from './models';
import { BaseUIComponentConstrutor } from './components/base-ui-component';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  private static COMPONENTS_REGISTER = new Map<string, BaseUIComponentConstrutor>();

  public static registerComponent({name, component, packageName}: ComponentDescriptor) {
    CoreService.COMPONENTS_REGISTER.set(`${packageName}:${name}`, component);
  }

  public static getComponent(type: string) {
    if (CoreService.COMPONENTS_REGISTER.has(type)) {
      return CoreService.COMPONENTS_REGISTER.get(type);
    }

    throw new Error(`Component ${type} is not registered`);
  }
}
