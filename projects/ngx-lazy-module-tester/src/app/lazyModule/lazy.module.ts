import { NgModule } from '@angular/core';

import { LazyComponent } from './lazy.component';
import { ModalComponentsFactory } from './lazy-module-components.factory';
@NgModule({
  declarations: [
    LazyComponent
    ],
  entryComponents: [ 
    LazyComponent 
    ],
  providers: [
    { provide: '$lazyComponents', useFactory: ModalComponentsFactory} 
  ]
})
export class LazyModule {
}