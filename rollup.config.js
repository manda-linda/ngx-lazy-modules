export default {
    entry: './dist/index.js',
    dest: './dist/bundles/ngxLazyModule.umd.js',
    format: 'umd',
    // Global namespace.
    moduleName: 'ngx.lazyModule',
    // External libraries.
    external: [
        '@angular/core',
        '@angular/common',
        'rxjs/Subject'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        'rxjs/Subject': 'Rx'
    },
    onwarn: () => {
        return
    }
}