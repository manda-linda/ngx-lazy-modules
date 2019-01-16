import { CommonModule } from '@angular/common';

import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { LazyModuleService } from './lazy-module.service';
import { LazyModuleOutletDirective } from './lazy-module-outlet.directive';
import { RouterModule } from '@angular/router';

@NgModule({
    exports: [
        LazyModuleOutletDirective
    ],
    declarations: [
        LazyModuleOutletDirective
    ],
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class NgxLazyModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxLazyModule,
      providers: [
        LazyModuleService
      ]
    };
  }
}