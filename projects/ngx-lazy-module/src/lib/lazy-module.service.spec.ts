import { Compiler, Injector, NgModuleFactory, NgZone } from '@angular/core';
import { instance, mock, when, anything } from 'ts-mockito';

import { LazyModuleService } from './lazy-module.service';

describe('<Unit Test> Lazy Module Service', () => {
    let service: LazyModuleService;
    let compilerMock: Compiler;
    let injectorMock: Injector;
    let moduleFactoryMock: NgModuleFactory<any>;
    let routerMock;
    let ngZoneMock;

    beforeEach(() => {
        compilerMock = mock(Compiler);
        injectorMock = mock(Injector);
        moduleFactoryMock = instance(mock(NgModuleFactory));
        (<any>moduleFactoryMock).create = () => {
            return 'module';
        };
        ngZoneMock = mock(NgZone);

        when(ngZoneMock.runOutsideAngular(anything())).thenCall((cb) => cb());

        routerMock = {
            config: [
                {
                    path: '__lazy/ModalsModule',
                    loadChildren: 'path/to/module#ModalsModule'
                },
                {
                    path: '__lazy/CartModule',
                    loadChildren: 'path/to/module#CartModule'
                }
            ],
            configLoader: {
                loader: {
                    load: (module): Promise<any> => {
                        if (module === 'path/to/module#CartModule') {
                            return Promise.resolve(moduleFactoryMock);
                        }
                        return Promise.resolve(module);
                    }
                }
            }
        };

        service = new LazyModuleService(
            routerMock,
            instance(injectorMock),
            instance(compilerMock),
            instance(ngZoneMock));
    });

    it('service should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('#constructor', () => {
        it('should initialize loadObservable and have empty loadedModules', () => {
            expect(service.loadObservable.subscribe).toBeDefined();
            expect(service.getModule['ModalsModule']).toBeUndefined();
        });
    });

    describe('#loadModule', () => {
        // @TODO still can't mock the type NgModuleFactory
        xit('should set LoadedModules with the module if it is of type NgModuleFactory.', (done) => {
            const subscribe = service.loadObservable.subscribe((value) => {
                expect(value['CartModule']).toBe('module');
                subscribe.unsubscribe();
                done();
            });
            service.loadModule('CartModule');
        });
        it('should compile/create module if it is not ngModuleFactory.', (done) => {
            const module = 'path/to/module#ModalsModule';
            (<any>service).compiler.compileModuleAsync = (mod) => {
                return Promise.resolve({
                    create: () => mod
                });
            };
            const subscribe = service.loadObservable.subscribe((value) => {
                expect(value['ModalsModule']).toBe(module);
                expect(service.getModule('ModalsModule')).toBe(module);
                subscribe.unsubscribe();
                done();
            });
            service.loadModule('ModalsModule');
        });
    });
});
