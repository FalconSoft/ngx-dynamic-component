type UIAction = (sender: UIModel, dataModel: any, uiModel: UIModel) => void;

export interface AttributesMap {
    width?: string;
    height?: string;
    margin?: string;
    padding?: string;
    label?: string;
    [key: string]: any;
}

export interface ActionsMap {
    [key: string]: UIAction;
}


export interface PropDescriptor {
  description: string;
  example: string;
}

export interface UIModel<T = AttributesMap> {
  key?: string;
  type: string;
  itemProperties: T;
  containerProperties: AttributesMap;
  children: UIModel[];
}

export interface IActionsContainer {
    actions: ActionsMap;
    hasAction(actionName: string): boolean;
    onRunAction(sender: UIModel, actionName: string, dataModel: any): void;
}

export interface ComponentDescriptor {
  package: string;
  category: string;
  name: string;
  description: string;
}
