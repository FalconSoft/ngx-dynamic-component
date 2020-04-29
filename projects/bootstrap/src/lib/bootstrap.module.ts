import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DynamicComponentsCoreModule } from '@ngx-dynamic-components/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NgSelectModule } from '@ng-select/ng-select';
import { setTheme } from 'ngx-bootstrap/utils';
import { TabsModule } from 'ngx-bootstrap/tabs';


import { SelectComponent } from './components/select/select.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { registerComponents } from './components/register';

@NgModule({
  declarations: [SelectComponent, TabsComponent],
  imports: [
    DynamicComponentsCoreModule,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    NgSelectModule,
    TabsModule.forRoot()
  ]
})
export class DynamicComponentsBootstrapModule {
  constructor() {
    setTheme('bs4');
    registerComponents();
  }
}
