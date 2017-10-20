import { LazyModuleService } from './lazy-module-service';
import { Injector, Compiler, NgModuleFactory } from '@angular/core';
import { mock, instance, when, anything } from 'ts-mockito';

describe('<Unit Test> Lazy Module Service', () => {
    let service: LazyModuleService;
    let compilerMock: Compiler;
    let injectorMock: Injector;
    let moduleFactoryMock: NgModuleFactory<any>;

    beforeEach(() => {
        compilerMock = mock(Compiler);
        injectorMock = mock(Injector);
        moduleFactoryMock = mock(NgModuleFactory);

        service = new LazyModuleService(
            {},
            instance(injectorMock),
            instance(compilerMock)
        );
    });

    it('service should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('#constructor', () => {
        it('should initialize loadObservable and have empty loadedModules', () => {
            expect(service.loadObservable.subscribe).toBeDefined();
            expect(service.getModule['ModalModule']).toBeUndefined();
        });
    });

    describe('#loadModule', () => {
        let module;
        beforeEach(() => {
            const unlockedService = service as any;
            module = instance(moduleFactoryMock);
            unlockedService.lazyModules['ModalModule'] = {
                loadChildren: (): Promise<any> => {
                    return Promise.resolve(module);
                }
            };
        });
        // @TODO can't mock instanceof NgModuleFactory right now
        xit('should set LoadedModules with the module if it is of.', (done) => {
            const subscribe = service.loadObservable.subscribe((value) => {
                expect(value['ModalModule']).toBe(module);
                subscribe.unsubscribe();
                done();
            });
            service.loadModule('ModalModule');
        });
        it('should compile/create module if it is not ngModuleFactory.', (done) => {
            module = 'my module';
            when(moduleFactoryMock.create(anything())).thenReturn(module);
            when(compilerMock.compileModuleAsync(anything())).thenReturn(Promise.resolve(instance(moduleFactoryMock)));
            const subscribe = service.loadObservable.subscribe((value) => {
                expect(value['ModalModule']).toBe(module);
                expect(service.getModule('ModalModule')).toBe(module);
                subscribe.unsubscribe();
                done();
            });
            service.loadModule('ModalModule');
        });
    });
});
