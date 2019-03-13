import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { UIModel, ActionsContainer, ActionsMap } from '@ngx-dynamic-components/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

enum Layout {
  horizontal = 'column',
  vertical = 'row'
}

@Component({
  selector: 'dc-preview-editor',
  templateUrl: './preview-editor.component.html',
  styleUrls: ['./preview-editor.component.scss']
})
export class PreviewEditorComponent implements OnInit, OnChanges {

  @Input() actionsMap: ActionsMap;
  @Input() initUiModel: UIModel;
  @Input() initDataModel: any;
  @Input() title: string;

  uiModel$: Observable<UIModel>;
  dataModel$: Observable<any>;
  actions: ActionsContainer;

  uiModelControl: FormControl;
  dataModelControl: FormControl;

  layout: Layout = Layout.horizontal;

  sourceCode = false;
  editorOptions = {
    language: 'json',
    automaticLayout: true
  };

  constructor() { }

  ngOnInit() {
    this.initUIPreview();
  }

  ngOnChanges({initUiModel}: SimpleChanges) {
    if (!initUiModel.firstChange) {
      this.initUIPreview();
    }
  }

  get isHorizontal() {
    return this.layout === Layout.horizontal;
  }

  toggleSourceCode() {
    this.sourceCode = ! this.sourceCode;
    if (!this.sourceCode) {
      this.layout = Layout.horizontal;
    }
  }

  toggleLayout() {
    this.layout = this.layout === Layout.horizontal ? Layout.vertical : Layout.horizontal;
  }

  onDataModelChange(data: any) {
    this.dataModelControl.setValue(JSON.stringify(data, null, 4));
  }

  private jsonValidFilter(jsonStr: string): boolean {
    try {
      JSON.parse(jsonStr);
      return true;
    } catch {
      return false;
    }
  }

  private initUIPreview() {
    this.actions = new ActionsContainer(this.actionsMap, this.initUiModel);

    const strUiModel = JSON.stringify(this.initUiModel, null, 4);
    const strDataModel = JSON.stringify(this.initDataModel, null, 4);

    this.uiModelControl = new FormControl(strUiModel);
    this.uiModel$ = this.uiModelControl.valueChanges.pipe(
      filter(this.jsonValidFilter),
      startWith(strUiModel),
      map(str => JSON.parse(str)));

    this.dataModelControl = new FormControl(strDataModel);
    this.dataModel$ = this.dataModelControl.valueChanges.pipe(
      filter(this.jsonValidFilter),
      startWith(strDataModel),
      map(str => JSON.parse(str)));
  }

}
