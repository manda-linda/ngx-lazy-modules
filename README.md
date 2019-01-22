# NgxLazyModule

This module contains tools for lazy loading modules outside of the routing context.

## Getting Started

Install and save as a dev dependency

`npm install ngx-lazy-module --save-dev`

### Add NgxLazyModule to Application

Add NgxLazyModule to the main application module. Use the `forRoot` function to provide a singleton of the LazyModuleService in your Angular application. Configure the RouterModule.forRoot with the modules you want to programatically load using the '__lazy/' prefix on the route and a `canActivate` guard to block routing. This allows us to use the Angular compiler to build the module in the context of the application and the prefix allows the LazyModuleService to identify the module for later. 
```
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    RouterModule.forRoot([{
          path: '__lazy/LazyModule',
          loadChildren: './lazyModule/lazy.module#LazyModule',
        canActivate: [ () => false]
        }
    ]),
    NgxLazyModule.forRoot()],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

### Add module-outlet to Application

Similar to the `router-outlet`, the `ngxLazyModuleOutlet` directive will mark the location where a component from a lazy module will be rendered. The directive requires a `name` attribute that corresponds with a lazy-loaded module and a `component` attribute that corresponds with the component to be rendered once the lazy module is loaded.

```
    <div ngxLazyModuleOutlet name="ModalsModule" component="ModalComponent"></div>
```

### Configure Lazy Modules 

In order for the `ngxLazyModuleOutlet` directive to access components in the lazy module, you will need to setup a provider called `$lazyComponents` in the lazy module to map components to string accessors. These components should also be added to "entryComponents" list in the module's configuration.

```
import { ModalComponent } from './modal.component';

export function ModalComponentsFactory() {
    return  {
        ModalComponent, // access with string 'Modal Component'
        AlternativeNameforModalComponent: ModalComponent // access with string 'AlternativeNameforModalComponent'
    };
}
```

```
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
```

### Load the Module When You Need It

Use the function `loadModule` in the `LazyModuleService` to programmatically load a module. Once the configure module is loaded the `ngxLazyModuleOutlet` directive will display the configured component.

```
  public loadModal() {
    this.lazyModuleService.loadModule('ModalsModule');
  }
```

## Local Development

Clone repo. npm i. Then use `npm run start` to run the demo project locally at http://localhost:4200










