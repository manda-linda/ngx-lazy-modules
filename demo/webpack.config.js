const webpack = require('webpack');
const path = require('path');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const aliases = {
  'index': path.join(__dirname, '../index.ts')
};
console.log(aliases);
// Webpack Config
var webpackConfig = {
  entry: {
    'polyfills': './demo/src/polyfills.browser.ts',
    'vendor': './demo/src/vendor.browser.ts',
    'main': './demo/src/main.browser.ts',
  },
  output: {
    path: '/dist',
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['main', 'vendor', 'polyfills'],
      minChunks: Infinity
    }),
    /**
     * Plugin: ContextReplacementPlugin
     * Description: Provides context to Angular's use of System.import
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
     * See: https://github.com/angular/angular/issues/11580
     */
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      // Helper functions
      path.resolve(__dirname, '..', 'src')
    ),

    new LoaderOptionsPlugin({})
  ],

  module: {
    loaders: [
      {
        /**
         *  MAKE SURE TO CHAIN VANILLA JS CODE, I.E. TS COMPILATION OUTPUT.
         */
        loader: 'ng-router-loader',
        options: {
          loader: 'async-require',
          genDir: `./compiled`,
          aot: false
        }
      },

      // .ts files for TypeScript
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader']
      }, {
        test: /\.css$/,
        loaders: ['to-string-loader', 'css-loader']
      }, {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },
  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }

};


// Our Webpack Defaults
var defaultConfig = {
  devtool: 'cheap-module-source-map',
  cache: true,
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: aliases
  },

  devServer: {
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    host: 'localhost',
    port: 3333
  }
};

var webpackMerge = require('webpack-merge');
module.exports = webpackMerge(defaultConfig, webpackConfig);
