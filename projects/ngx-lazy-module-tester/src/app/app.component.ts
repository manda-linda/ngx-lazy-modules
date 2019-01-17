import { Component } from '@angular/core';
import { LazyModuleService } from 'dist/ngx-lazy-module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngx-lazy-module-tester';
  constructor(private lazyModuleService: LazyModuleService) {
  }

  public loadModal() {
    this.lazyModuleService.loadModule('LazyModule');
  }
}
