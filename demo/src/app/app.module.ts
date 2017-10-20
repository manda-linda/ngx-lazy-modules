import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxLazyModule } from 'index'
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    NgxLazyModule.forRoot({
      ModalsModule: {
          loadChildren: './modules/modals/modals.module.ts#ModalsModule'
        }
  })],
  bootstrap: [AppComponent]
})
export class AppModule {
}