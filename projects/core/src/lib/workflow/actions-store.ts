import { ExecutionContext } from './workflow.processor';
import { JSONUtils } from './json.utils';
import { SetValueConfig, SetValuesConfig, GetValueConfig, AddItemConfig, PushItemConfig,
  TransferDataConfig, MergeInDataModelConfig, SetVariableConfig } from './models';
import { ActionDescriptor } from '../models';
import { resolveValue, resolveVariable } from './actions-core';

const setValueAction = (context: ExecutionContext, config: SetValueConfig) => {
    const objValue = resolveValue(context, config.object);
    const value = resolveValue(context, config.propertyValue);
    return JSONUtils.setValue(objValue, config.propertyName, value);
};

const setValuesAction = (context: ExecutionContext, config: SetValuesConfig) => {
    const propertyNames = Object.keys(config.valuesList).filter(f => !f.startsWith('_'));
    const objValue = resolveValue(context, config.object);
    for (const propertyName of propertyNames) {
        const value = resolveValue(context, config.valuesList[propertyName]);
        JSONUtils.setValue(objValue, propertyName, value);
    }
};

const switchAction = (context: ExecutionContext, config: SetValuesConfig) => {

};

const getValueAction = (context: ExecutionContext, config: GetValueConfig) => {
    const objValue = resolveValue(context, config.object);
    const propertyName = resolveValue(context, config.propertyName);
    return JSONUtils.find(objValue, propertyName);
};

const getListFromContext = (context: ExecutionContext, config: AddItemConfig | PushItemConfig) => {
  const objValue = resolveValue(context, config.object);
  const propertyName = config.propertyName;
  const list = JSONUtils.find(objValue, propertyName);
  if (Array.isArray(list)) {
    return list;
  }

  if (list === null) {
    JSONUtils.setValue(objValue, propertyName, []);
    return JSONUtils.find(objValue, propertyName);
  }

  throw new Error(`Property ${propertyName} in ${config.object} is not an array.`);
};

const addItemToArrayAction = (context: ExecutionContext, config: AddItemConfig) => {
  const list = getListFromContext(context, config);
  const objValue = resolveValue(context, config.object);
  const item = JSONUtils.find(objValue, config.itemPropertyName);
  return JSONUtils.setValue(objValue, config.propertyName, [...list, {[config.wrapName]: item}]);
};

const pushItemToArrayAction = (context: ExecutionContext, config: PushItemConfig) => {
  const list = getListFromContext(context, config);
  const objValue = resolveValue(context, config.object);
  const targetValue = resolveValue(context, config.target);
  return JSONUtils.setValue(objValue, config.propertyName, [...list, {[config.wrapName]: targetValue}]);
};

const popArrayAction = (context: ExecutionContext, config: AddItemConfig) => {
  const list = getListFromContext(context, config);
  const objValue = resolveValue(context, config.object);
  return JSONUtils.setValue(objValue, config.propertyName, [...list.slice(0, list.length - 1)]);
};

const setLocalVariableAction = (context: ExecutionContext, config: SetVariableConfig) => {
  try {
    const resolved = resolveVariable(context, config.sourceValue);
    if (!resolved) {
      throw new Error(`Local variable ${config.sourceValue} is not resolved`);
    }
    const value = JSONUtils.find(resolved.value as object, resolved.name);
    context.variables.set(config.variableName, value);
    return value;
  } catch (e) {
    console.error(e);
    return null;
  }
 };

/**
 * @example
 * {
 *  "actionType": "transferData",
 *  "from": "$step1-returnValue",
 *  "fromPropertyName": "$",
 *  "to": "$dataModel",
 *  "toPropertyName": "$.transfered"
 * }
 */
const transferDataAction = (context: ExecutionContext, config: TransferDataConfig) => {
  const fromObj = resolveValue(context, config.from);
  const value = JSONUtils.find(fromObj, config.fromPropertyName || '$');
  const toObj = resolveValue(context, config.to);
  return JSONUtils.setValue(toObj, config.toPropertyName, value);
};

const mergeInDataModelAction = (context: ExecutionContext, config: MergeInDataModelConfig) => {
  const value = config.data;
  const dataModel = resolveValue(context, '$dataModel');
  Object.assign(dataModel, value);
  return dataModel;
};

const getValueDescriptor = {
  name: 'getValueAction',
  method: getValueAction,
  category: 'Common',
  config: {
    actionType: 'getValueAction',
    actionName: 'get-value-1',
    object: '$data',
    propertyName: 'propName'
  },
  description: 'Gets value from object by propertyName path'
};

const setValueDescriptor = {
  name: 'setValueAction',
  method: setValueAction,
  category: 'Common',
  config: {
    actionType: 'setValueAction',
    actionName: 'set-value-1',
    object: '$data',
    propertyName: 'propName',
    propertyValue: 'value-1'
  } as SetValueConfig,
  description: 'Sets value to propertyName in objet'
};

const setValuesDescriptor = {
  name: 'setValuesAction',
  method: setValuesAction,
  category: 'Common',
  config: {
    actionType: 'setValuesAction',
    actionName: 'set-values-1',
    object: '$data',
    valuesList: {prop: 'value-1'}
  } as SetValuesConfig,
  description: 'Sets properties values in object'
};

const addItemToArrayDescriptor = {
  name: 'addItemToArrayAction',
  method: addItemToArrayAction,
  category: 'Common',
  config: {
    actionType: 'addItemToArrayAction',
    actionName: 'add-item-1',
    object: '$data',
    propertyName: 'arrayProp',
    itemPropertyName: 'dataProp',
    wrapName: 'item'
  } as AddItemConfig,
  description: 'Push item from current object into array property'
};

const pushItemToArrayDescriptor = {
  name: 'pushItemToArrayAction',
  method: pushItemToArrayAction,
  category: 'Common',
  config: {
    actionType: 'pushItemToArrayAction',
    actionName: 'push-item-1',
    object: '$fromVar',
    target: '$toVar',
    propertyName: 'prop1',
    targetPropertyName: 'prop2',
    wrapName: 'item'
  } as PushItemConfig,
  description: 'Push item from custom object into array property'
};

const popArrayDescriptor = {
  name: 'popArrayAction',
  method: popArrayAction,
  category: 'Common',
  config: {
    actionType: 'popArrayAction',
    actionName: 'pop-item-1',
    object: '$dataVar',
    propertyName: 'prop1',
  },
  description: 'Pop item from object array property'
};

const transferDataDescriptor = {
  name: 'transferDataAction',
  method: transferDataAction,
  category: 'Common',
  config: {
    actionType: 'transferDataAction',
    actionName: 'data-transfer-1',
    from: 'object1',
    fromPropertyName: 'prop1',
    to: 'object2',
    toPropertyName: 'prop2'
  },
  description: 'Transfer data from object1 to object2'
};

const setLocalVariableDescriptor = {
  name: 'setLocalVariableAction',
  method: setLocalVariableAction,
  category: 'Common',
  config: {
    actionType: 'setLocalVariableAction',
    actionName: 'set-local-1',
    sourceValue: '{{responseContent}}/user/userName',
    variableName: 'userName',
  } as SetVariableConfig,
  description: 'Set value to local context'
};

const mergeInDataModelDescriptor = {
  name: 'mergeInDataModelAction',
  method: mergeInDataModelAction,
  category: 'Common',
  config: {
    actionType: 'mergeInDataModelAction',
    actionName: 'merge-data-1',
    data: '{prop: 2}',
  } as MergeInDataModelConfig,
  description: 'Merge data into DataModel'
};

export const commonActionsMap = new Map<string, ((...args: any[]) => any) | ActionDescriptor>([
    ['switch', () => {}],
    ['getValue', getValueDescriptor],
    ['setValue', setValueDescriptor],
    ['setValues', setValuesDescriptor],
    ['addItemToArray', addItemToArrayDescriptor],
    ['popArray', popArrayDescriptor],
    ['pushItemToArray', pushItemToArrayDescriptor],
    ['transferData', transferDataDescriptor],
    ['setLocalVariable', setLocalVariableDescriptor],
    ['mergeInDataModel', mergeInDataModelDescriptor]
]);
