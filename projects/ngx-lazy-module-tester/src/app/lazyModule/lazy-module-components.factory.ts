import { LazyComponent } from './lazy.component';

/*
* This factory maps keys to Components so they can be referenced by the lazy-module-outlet directive
* These components should also be added to  "entryComponents" list in the module
*/
export function ModalComponentsFactory() {
    return  {
        LazyComponent,
        AlternativeNameforModalComponent: LazyComponent
    };
}
