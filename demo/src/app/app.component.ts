import { Component } from '@angular/core';
import { LazyModuleService } from 'index';
@Component({
  selector: 'app',
  template: `
    <div> app </div>
    <button (click)="loadModal()">Lazy Load Modal Module</button>
    <div ngxLazyModuleOutlet name="ModalsModule" component="ModalComponent"></div>
  `
})
export class AppComponent {
  constructor(private lazyModuleService: LazyModuleService) {
  }

  public loadModal() {
    this.lazyModuleService.loadModule('ModalsModule');
  }
}