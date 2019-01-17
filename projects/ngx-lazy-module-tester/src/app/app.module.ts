import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { NgxLazyModule } from 'dist/ngx-lazy-module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([{
          path: '__lazy/LazyModule',
          loadChildren: './lazyModule/lazy.module#LazyModule',
          canActivate: [ () => false]
        }
      ]),
    NgxLazyModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
