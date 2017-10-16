import { LazyModuleService } from './lazy-module-service';
import { Attribute, ChangeDetectorRef, ComponentRef, Directive, OnDestroy, OnInit, ViewContainerRef, NgModuleRef } from '@angular/core';

/**
 * This directive acts as a placeholder that we replace with a lazy-module's first bootstrapComponent when the module is loaded.
 * It is based on the router-outlet directive from angular/router
 *
 * 'name' attribute should reference the module type/key that is configured in the lazy-module-service. This directive listens to
 *  the service and attaches the module once it is loaded.
 * ```
 * <div ngxLazyModuleOutlet name="ModalModule"></div>
 * ```
 */
@Directive({selector: '[ngxLazyModuleOutlet]'})
export class LazyModuleOutletDirective implements OnInit, OnDestroy {
    private activated: ComponentRef<any>|null = null;
    private name: string;
    private componentName: string;
    private subscriber;

    constructor(
        private location: ViewContainerRef,
        // tslint:disable-next-line:no-attribute-parameter-decorator
        @Attribute('name') name: string,
        // tslint:disable-next-line:no-attribute-parameter-decorator
        @Attribute('component') componentName: string,
        private changeDetector: ChangeDetectorRef,
        private lazyModuleService: LazyModuleService) {
            this.name = name;
            this.componentName = componentName;
    }

    public ngOnInit(): void {
        if (this.lazyModuleService.getModule(this.name)) {
            this.attach(this.lazyModuleService.getModule(this.name));
        } else {
            this.subscriber = this.lazyModuleService.loadObservable.subscribe((loadedModules) => {
                if (!this.isActivated && loadedModules[this.name]) {
                    this.attach(loadedModules[this.name]);
                }
            });
        }
    }

    public ngOnDestroy() {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
        }
        this.deactivate();
    }

    public get isActivated(): boolean { return !!this.activated; }

    public get component(): any {
        if (!this.activated) {
            throw new Error('Outlet is not activated');
        }
        return this.activated.instance;
    }

    public attach(module: NgModuleRef<any>) {
        const factory = this.lazyModuleService.resolveComponent(module, this.componentName);
        this.activated = this.location.createComponent(factory, this.location.length, module.injector);
        this.location.insert(this.activated.hostView);
        this.changeDetector.detectChanges();
    }

    public deactivate(): void {
        if (this.isActivated) {
            this.activated.destroy();
            this.activated = null;
        }
    }
}
