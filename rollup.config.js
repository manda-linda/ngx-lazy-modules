export default {
    entry: './dist/index.js',
    dest: './dist/bundles/ngxLazyModule.umd.js',
    format: 'umd',
    // Global namespace.
    moduleName: 'NgxLazyModule',
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