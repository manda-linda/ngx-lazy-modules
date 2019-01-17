import { Injectable, NgModuleFactory, Compiler, Injector, NgModuleRef, ComponentFactory, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

/**
 * This service utilizes https://github.com/shlomiassaf/ng-router-loader to build lazy modules and to replace
 * the loadChildren string with a function that returns the module. This is the same pattern used in the lazy-router.
 *
 * Make sure that the module type is both the Key and the suffix to the import string ('#ModalModule')
 */
class ModuleDict {
    [key: string]: string
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
        private router: Router,
        private injector: Injector,
        private compiler: Compiler,
        private ngZone: NgZone) {
        this.loadObservable = new Subject();
        this.lazyModules = this.buildLazyModuleRefs();
    }

    public loadModule(name: string): Promise<NgModuleRef<any>> {
        if (this.lazyModules[name] && !this.loadedModules[name] && !this.loading[name]) {
            this.loading[name] = [];
            return (this.router as any).configLoader.loader
                .load(this.lazyModules[name])
                .then((t) => {
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
    public preCacheModule(name: string, DELAY: number): void {
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => this.loadModule(name), DELAY);
        });
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

    private buildLazyModuleRefs() {
        const refs = {};
        if (this.router.config && this.router.config.length) {
            this.router.config.forEach((config) => {
                if (
                    config.path.indexOf('__lazy') !== -1 &&
                    config.loadChildren &&
                    typeof config.loadChildren === 'string'
                ) {
                    const name = config.loadChildren.split('#')[1];
                    refs[name] = config.loadChildren;
                } else if (config.path.indexOf('__lazy') !== -1 && config.loadChildren) {
                    console.warn(`LoadChildren is not a string: ${config}`);
                }
            });
        }

        return refs;
    }
}
