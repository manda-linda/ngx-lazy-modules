import { Injectable, NgModuleFactory, Compiler, Inject, Injector, NgModuleRef, ComponentFactory } from '@angular/core';
import { Subject } from 'rxjs/Subject';
/**
 * This service utilizes https://github.com/shlomiassaf/ng-router-loader to build lazy modules and to replace
 * the loadChildren string with a function that returns the module. This is the same pattern used in the lazy-router.
 *
 * Make sure that the module type is both the Key and the suffix to the import string ('#ModalModule')
 */
class ModuleDict {
    [key: string]: {
        loadChildren: any // Change this, break everything
    }
}

@Injectable()
export class LazyModuleService {
    // Observable of lazy loaded modules
    public loadObservable: Subject<any>;
    public loading: any = {};
    private lazyModules: ModuleDict;
    private loadedModules: any = {};

    // For the AOT build this will not actually inject the compiler
    constructor(
        @Inject('LazyConfig') private config,
        private injector: Injector,
        private compiler: Compiler) {
        this.loadObservable = new Subject();
        if (!this.config) {
            console.warn('Missing Lazy Module \"modules\" configuration.');
        }
        this.lazyModules = this.config || {};
    }

    public loadModule(name: string): Promise<NgModuleRef<any>> {
        if (this.lazyModules[name] && !this.loadedModules[name] && !this.loading[name]) {
            this.loading[name] = [];
            const moduleFn = this.lazyModules[name].loadChildren as () => Promise<any>;
            return moduleFn().then((t) => {
                    if (t instanceof NgModuleFactory) {
                        return t;
                    } else {
                        return this.compiler.compileModuleAsync(t);
                    }
                }).then((factory) => {
                    const mod = factory.create(this.injector);
                    this.loadedModules[name] = mod;
                    this.loading[name].forEach((promise) => {
                        promise.resolve(mod);
                    });
                    this.loading[name] = undefined;
                    this.loadObservable.next(this.loadedModules);
                    return mod;
                });
        } else if (this.lazyModules[name] && !this.loadedModules[name] && this.loading[name]) {
            const deferred: Promise<any> = new Promise((resolve) => {
                this.loading[name].push({
                    resolve
                });
            });
            return deferred;
        } else if (this.lazyModules[name] && this.loadedModules[name]) {
            return Promise.resolve(this.loadedModules[name]);
        } else {
            return Promise.reject({ error: 'No lazy module registered by name:' + name });
        }
    }

    public getModule(name: string): NgModuleRef<any> {
        return this.loadedModules[name];
    }
    // @return component<any>
    public getComponent(module: NgModuleRef<any>, componentName?: string): any {
        let factory;
        if (componentName) {
            const lazyComponents = module.injector.get('$lazyComponents');
            if (lazyComponents && lazyComponents[componentName]) {
                 factory = lazyComponents[componentName];
            } else {
                console.warn('Unable to resolve lazy component: ' + componentName);
            }
        } else if ((module as any)._bootstrapComponents && (module as any)._bootstrapComponents[0]) {
            factory = (module as any)._bootstrapComponents[0];
        }
        return factory;
    }
    public resolveComponent(module: NgModuleRef<any>, componentName?: string): ComponentFactory<any> {
        const component = this.getComponent(module, componentName);
        return module.componentFactoryResolver.resolveComponentFactory(component);
    }
}
