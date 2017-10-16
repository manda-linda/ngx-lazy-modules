export default {
    entry: './dist/index.js',
    dest: './dist/bundles/ngxLazyModules.umd.js',
    format: 'umd',
    // Global namespace.
    moduleName: 'NgxLazyModules',
    // External libraries.
    external: [
        '@angular/core',
        '@angular/common',
        'rxjs/Subject'
    ],
    onwarn: () => {
        return
    }
}