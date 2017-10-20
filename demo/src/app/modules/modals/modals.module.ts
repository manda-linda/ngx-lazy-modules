import { NgModule } from '@angular/core';

import { ModalComponent } from './modal.component';
import { ModalComponentsFactory } from './modals-module-components.factory';
@NgModule({
  declarations: [
      ModalComponent
    ],
  entryComponents: [ 
      ModalComponent 
    ],
  providers: [
    { provide: '$lazyComponents', useFactory: ModalComponentsFactory} 
  ]
})
export class ModalsModule {
}