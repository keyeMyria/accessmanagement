var webpack = require('webpack');
const WebpackRTLPlugin = require('webpack-rtl-plugin');
/* Import webpack-manifest-plugin */
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');

var path = require('path');
var BUILD_DIR = path.resolve(__dirname, './public');
var APP_DIR = path.resolve(__dirname, 'src/client');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Import our plugin -> ADDED IN THIS STEP
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //  -> ADDED IN THIS STEP
const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  SRC: path.resolve(__dirname, 'src/client'),
  JS: path.resolve(__dirname, 'src/js'),
};
const PUBLIC_PATH = 'http://localhost:8080/';

var config = {
  entry: APP_DIR + '/app/index.jsx',
  output: {
    path: path.join(__dirname, '/public/'),
        filename: 'bundle.js',
        publicPath: PUBLIC_PATH
  },
  module : {
    loaders : [

                {
                  test: /\.(js|jsx)$/,
                  include : paths.SRC,
                  loader : 'babel-loader',
                  query: {
                plugins: ['transform-decorators-legacy']
              }
                } ,
                {
                  test: /\.css$/,
                  loader: ExtractTextPlugin.extract({
                    use: 'css-loader',
                  }),
                },
                {
                  test: /\.svg$/,
                use: [
                  {
                    loader: "babel-loader"
                  },
                  {
                    loader: "svg-react-loader",
                    options: {
                      jsx: true // true outputs JSX tags
                    }
                  }
                ]

                },
                {
                  test: /\.(gif|png|jpe?g)$/i,
                  use: [
                    'file-loader',
                    {
                      loader: 'image-webpack-loader',
                      options: {
                        bypassOnDebug: true,
                      },
                    },
                  ],
                }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(BUILD_DIR, 'index.html'),
    }),
    new ExtractTextPlugin('css/[name].css') ,
    new WebpackRTLPlugin(),
    // new WorkboxPlugin.InjectManifest({
    //   swSrc: BUILD_DIR+'/sw.js',
    //   swDest: 'sw.js'
    // })
    // new WorkboxPlugin.GenerateSW({
    //   runtimeCaching: [{
    //     // Match any same-origin request that contains 'api'.
    //     urlPattern: /localhost:8080/,
    //     // Apply a network-first strategy.
    //     handler: 'networkFirst',
    //     options: {
    //       // Fall back to the cache after 10 seconds.
    //       networkTimeoutSeconds: 10,
    //       // Use a custom cache name for this route.
    //       cacheName: 'my-api-cache',
    //       // Configure custom cache expiration.
    //       expiration: {
    //         maxEntries: 5,
    //         maxAgeSeconds: 60,
    //       },
    //       // Configure which responses are considered cacheable.
    //       cacheableResponse: {
    //         statuses: [0, 200],
    //         headers: {'x-test': 'true'},
    //       },
    //       // Configure the broadcast cache update plugin.
    //       broadcastUpdate: {
    //         channelName: 'my-update-channel',
    //       },

    //     },
    //   }, {
    //     // To match cross-origin requests, use a RegExp that matches
    //     // the start of the origin:
    //     urlPattern: new RegExp('^/'),
    //     handler: 'staleWhileRevalidate',
    //     options: {
    //       cacheableResponse: {
    //         statuses: [0, 200]
    //       }
    //     }
    //   }]
    // }),
    // new WorkboxPlugin.InjectManifest(),
    // new WebpackPwaManifest({
    //   name: 'My Applications Friendly Name',
    //   short_name: 'Application',
    //   description: 'Description!',
    //   background_color: '#01579b',
    //   theme_color: '#01579b',
    //   'theme-color': '#01579b',
    //   start_url: '/',
    //   icons: [
    //     {
    //       src: path.resolve(BUILD_DIR +'/icon.png'),
    //       sizes: [96, 128, 192, 256, 384, 512],
    //       destination: path.join('assets', 'icons')
    //     }
    //   ]
    // })

  ],
  node: {
   fs: "empty"
},
devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    proxy: {
      '/manage-single-event/*': {
        target: 'http://localhost:8080/',
        pathRewrite: { '^/manage-single-event': '' },
      }
    }
  },
};

module.exports = config;
