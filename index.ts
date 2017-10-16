import { CommonModule } from '@angular/common';

import {
  NgModule,
  ModuleWithProviders,
  Inject,
  Optional,
  OpaqueToken,
  SkipSelf
} from '@angular/core';

import { LazyModuleService } from './src/lazy-module-service';
import { LazyModuleOutletDirective } from './src/lazy-module-outlet.directive';

export * from './src/lazy-module-service';
export * from './src/lazy-module-outlet.directive';


export const NG2LAZYMODULE_FORROOT_GUARD = new OpaqueToken('LAZY MODULE FORROOT GUARD');
export function provideForRootGuard(lazyModuleService: LazyModuleService): any {
  if (lazyModuleService) {
    throw new Error(
      `Ng2LazyModule.forRoot() called twice. Lazy loaded modules should declare directives directly.`);
  }
  return 'guarded';
}
@NgModule({
    exports: [
        LazyModuleOutletDirective
    ],
    declarations: [
        LazyModuleOutletDirective
    ],
    imports: [
        CommonModule
    ]
})
export class NgxLazyModule {
  constructor(@Optional() @Inject(NG2LAZYMODULE_FORROOT_GUARD) guard: any) {}

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxLazyModule,
      providers: [
        {
          provide: NG2LAZYMODULE_FORROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[LazyModuleService, new Optional(), new SkipSelf()]]
        },
        LazyModuleService
      ]
    };
  }
}
