let mix = require('laravel-mix')
let webpack = require('webpack')

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application.
 |
 */

mix.setPublicPath('public')

mix.options({
  processCssUrls: false,
  purifyCss: false // Remove unused CSS selectors.
})

mix.webpackConfig({
  resolve: {
    alias: {
      '@': path.resolve('frontend/js'),
      'styles': path.resolve('frontend/scss')
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'assets/admin/js/vendor',
      minChunks: function (module) {
        // This prevents stylesheet resources with these extensions
        // from being moved from their original chunk to the vendor chunk
        if (module.resource && (/^.*\.(css|scss|less)$/).test(module.resource)) {
          return false
        }
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'assets/admin/js/manifest',
      minChunks: Infinity
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve('frontend/js')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }
    ]
  }
})

mix.copyDirectory('frontend/fonts', 'public/assets/admin/fonts')

mix.js(
  'frontend/js/main-listing.js',
  'public/assets/admin/js'
).js(
  'frontend/js/main-form.js',
  'public/assets/admin/js'
).js(
  'frontend/js/main-buckets.js',
  'public/assets/admin/js'
).js(
  'frontend/js/main-dashboard.js',
  'public/assets/admin/js'
).sass(
  'frontend/scss/app.scss',
  'public/assets/admin/css'
)

if (mix.inProduction()) {
  mix.version()
} else {
  mix.sourceMaps()
}
