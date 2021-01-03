import { Injectable } from '@angular/core';
import { ComponentDescriptor, UIModel, AttributesMap, XMLResult } from '../models';
import { BaseUIComponentConstructor, toXMLResult, BaseHTMLElementConstructor, parseXmlStringPromise } from '../utils';
import { controlProperties, UIModelProperty } from '../properties';

/**
 * Child Elements directives within Containers
 * @link https://github.com/angular/flex-layout/wiki/API-Documentation
 */
const FX_CONTAINER_DIRECTIVES = ['fxFlex', 'fxFlexOrder', 'fxFlexOffset', 'fxFlexAlign', 'fxFlexFill'];

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static readonly COMPONENTS_REGISTER = new Map<string, ComponentDescriptor>();

  public static registerComponent(desc: ComponentDescriptor): void {
    const { name, packageName, propertiesDescriptor } = desc;
    // @deprecated
    if (propertiesDescriptor) {
      propertiesDescriptor.forEach(prop => {
        controlProperties.set(`${name}:${prop[0]}`, prop[1]);
      });
    }
    CoreService.COMPONENTS_REGISTER.set(name, desc);
  }

  public static getComponent(type: string): BaseUIComponentConstructor | BaseHTMLElementConstructor {
    if (CoreService.COMPONENTS_REGISTER.has(type)) {
      return CoreService.COMPONENTS_REGISTER.get(type).component;
    }

    throw new Error(`Component ${type} is not registered`);
  }

  public static getComponentDescriptor(type: string): ComponentDescriptor {
    if (CoreService.COMPONENTS_REGISTER.has(type)) {
      return CoreService.COMPONENTS_REGISTER.get(type);
    }

    throw new Error(`ComponentDescriptor ${type} is not registered`);
  }

  public static getComponentProperties(type: string): UIModelProperty[] {
    try {
      const desc = CoreService.getComponentDescriptor(type);
      return desc.itemProperties.prototype.properties;
    } catch (e) {
      throw e;
    }
  }

  public static getListOfComponents(): Array<ComponentDescriptor> {
    return Array.from(CoreService.COMPONENTS_REGISTER.values());
  }

  public static async parseXMLModel(uiModelXml: string): Promise<UIModel> {
    try {
      const res = await parseXmlStringPromise(uiModelXml);

      if (res) {
        const type = Object.keys(res)[0];
        const xmlObj = res[type];
        if(typeof xmlObj === 'string')
        {
          throw Error(`Invalid XML, please make sure file can't start with comment <!-- -->`);
        }
        xmlObj['#name'] = type;
        return CoreService.getUIModel(toXMLResult(xmlObj));
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static getUIModel(xmlRes: XMLResult): UIModel {
    const itemProperties = xmlRes.attrs;
    const type = xmlRes.type;

    if (itemProperties.disabled === 'true') {
      itemProperties.disabled = true;
    } else if (itemProperties.hasOwnProperty('disabled')) {
      itemProperties.disabled = null;
    }

    if (CoreService.COMPONENTS_REGISTER.has(type)) {
      const uiModel: UIModel = {
        type,
        itemProperties
      };

      if (itemProperties.id) {
        uiModel.id = itemProperties.id;
      }

      const descr = CoreService.COMPONENTS_REGISTER.get(type);
      if (typeof descr.parseUIModel === 'function') {
        const typeUIModel = descr.parseUIModel(xmlRes);
        uiModel.itemProperties = { ...itemProperties, ...typeUIModel.itemProperties };
        if (typeUIModel.children) {
          uiModel.children = typeUIModel.children;
        }
      }

      if (xmlRes.childNodes && !uiModel.children) {
        uiModel.children = xmlRes.childNodes
          .filter(n => n['#name'] !== '#comment')
          .map((r: any) => CoreService.getUIModel(toXMLResult(r)));
      }
      return uiModel;
    } else {
      throw Error(`No component for tag ${type}`);
    }
  }
}
