import type { Injector, ViewContainerRef } from '@angular/core';
import { OnInit, OnDestroy, EventEmitter, SimpleChanges, OnChanges, Directive } from '@angular/core';
import { UIModel, ComponentEvent, XMLResult } from '../models';
import { StyleProperties, StylePropertiesList, BaseProperties, propDescription } from '../properties';
import { UISelectorComponent } from './ui-selector-component';
import { BaseDynamicComponent } from './base-dynamic-component';

@Directive()
export class BaseHTMLElement<T = HTMLProperties> extends BaseDynamicComponent<T> implements OnInit, OnDestroy, OnChanges { // eslint-disable-line
    dataModel: any;
    uiModel: UIModel<T>;
    eventHandlers = new EventEmitter<ComponentEvent>();
    changedDataModel = new EventEmitter();
    element: HTMLElement;
    private parentNode: Node;

    constructor(private containreRef?: ViewContainerRef, protected injector?: Injector) {
      super();
    }

    async ngOnDestroy(): Promise<void> {
      this.emitEvent((this.properties as BaseProperties).onDestroy);
      if (this.element) {
        this.element.parentNode.removeChild(this.element);
      }
    }

    async ngOnChanges({dataModel, uiModel}: SimpleChanges): Promise<void> {
      if (dataModel && !dataModel.firstChange && this.dataModel !== dataModel.currentValue) {
        this.dataModel = dataModel.currentValue;
      }

      if (uiModel && !uiModel.firstChange) {
        this.uiModel = uiModel.currentValue;
        this.setProperties();
      }
    }

    create(selectorElement: HTMLElement): void {
      const created = Boolean(this.element);
      this.element = this.element || document.createElement(this.uiModel.type);
      this.element.innerHTML = '';
      this.parentNode = this.parentNode || selectorElement.parentNode;
      this.setProperties();
      if (!created && this.parentNode) {
        this.parentNode.insertBefore(this.element, selectorElement);
      }
      if (this.uiModel.children) {
        this.uiModel.children.forEach(uiModel => {
          const componentRef = this.containreRef.createComponent(UISelectorComponent);;
          const component =  componentRef.instance;
          component.dataModel = this.dataModel;
          component.uiModel = uiModel;
        });
      }
      if (this.parentNode && !created) {
        this.parentNode.removeChild(selectorElement);
      }
    }

    private setProperties(): void {
      const htmlProps = this.properties as HTMLProperties;
      if (htmlProps.content) {
        this.element.textContent = htmlProps.content;
      }
      if (htmlProps.title) {
        this.element.title = htmlProps.title;
      }
      this.setHostStyles();
    }

    get properties(): T {
      return this.uiModel.itemProperties;
    }

    get attrs(): T {
      return this.uiModel.itemProperties;
    }

    protected setHostStyles(): void {
      const props = this.properties as StyleProperties;
      if (props.class) {
        this.element.className = props.class;
      }
      if (props) {
        StylePropertiesList.forEach(b => {
          if (props && props.hasOwnProperty(b)) {
            this.element.style[b] = props[b];
          }
        });
      }
    }
}

export class HTMLProperties extends StyleProperties {
  @propDescription({
    description: 'HTML element text content',
    example: 'Text'
  })
  content?: string;

  @propDescription({
    description: 'HTML element html content',
    example: '<span>Text</span>'
  })
  htmlContent?: string;

  @propDescription({
    description: 'HTML element title',
    example: 'Description text'
  })
  title?: string;
}

export type HTMLPropertiesConstrutor = new () => HTMLProperties;

export function parseHTMLUIModel(xmlRes: XMLResult): UIModel {
  const content = xmlRes.content;
  return {
    type: xmlRes.type,
    itemProperties: { content }
  };
}

