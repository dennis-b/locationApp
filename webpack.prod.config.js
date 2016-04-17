// @AngularClass

/*
 * Helper: root(), and rootDir() are defined at the bottom
 */
var helpers = require('./helpers');
var path = require('path');
// Webpack Plugins
var webpack = require('webpack');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');
var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var ENV = process.env.NODE_ENV = process.env.ENV = 'production';
var HOST = process.env.HOST || 'localhost';
var PORT = process.env.PORT || 8080;

var metadata = {
    baseUrl: '/',
    host: HOST,
    port: PORT,
    ENV: ENV
};

/*
 * Config
 */
module.exports = {
    // static data for index.html
    metadata: metadata,

    entry: [
        path.resolve('src/app/app')
    ],

    output: {
        path: path.resolve(__dirname, "www/out"),
        publicPath: "out/",
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map'
    },

    resolve: {
        cache: false,
        alias: {
            annotations: path.join(__dirname, "src/app/core/annotations"),
            utils: path.join(__dirname, "src/app/core/utils"),
            entities: path.join(__dirname, "src/app/common/entities"),
            ng2adapter: path.join(__dirname, "src/app/common/ng2/adapter"),
            cloud: path.join(__dirname, "src/app/parse/cloud"),
            const: path.join(__dirname, "src/app/core/constants/constants"),
            angular2: path.resolve('node_modules/angular2')
        }
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: [/app\/parse/, /app\/lib/, /jspm_packages/, /.tmp/, /build/, /gulp/, /node_modules/, /bower_components/, /bld/],
                loader: ['babel-loader'],
                query: {
                    plugins: ['transform-decorators-legacy', 'transform-object-assign'],
                    presets: ['es2015', 'stage-0']
                }
            },
            {test: /\.css$/, loader: "style-loader!css-loader!postcss-loader"},
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?name=img/[name].[ext]',
                    'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                ]
            },
            {test: /\.html$/, loader: 'raw-loader'}

        ],
        noParse: [
            /es6-shim/,
            /reflect-metadata/,
            /zone\.js(\/|\\)dist(\/|\\)zone-microtask/
        ]
    },

    postcss: function () {
        return [precss, autoprefixer];
    },

    plugins: [
        new WebpackMd5Hash(),
        new DedupePlugin(),
        new OccurenceOrderPlugin(true),
        new DefinePlugin({
            // Environment helpers
            'process.env': {
                'ENV': JSON.stringify(metadata.ENV),
                'NODE_ENV': JSON.stringify(metadata.ENV)
            }
        }),
        new webpack.ProvidePlugin({

            jQuery: "jquery",
            $: "jquery",
            "window.jQuery": "jquery",

            _: "lodash",
            "window._": "lodash",

            moment: "moment",
            "window.moment": "moment"
        }),
        new UglifyJsPlugin({
            // to debug prod builds uncomment //debug lines and comment //prod lines

            // beautify: true,//debug
            // mangle: false,//debug
            // dead_code: false,//debug
            // unused: false,//debug
            // deadCode: false,//debug
            // compress : { screw_ie8 : true, keep_fnames: true, drop_debugger: false, dead_code: false, unused: false, }, // debug
            // comments: true,//debug

            beautify: false,//prod
            // disable mangling because of a bug in angular2 beta.1, beta.2 and beta.3
            // TODO(mastertinner): enable mangling as soon as angular2 beta.4 is out
            // mangle: { screw_ie8 : true },//prod
            mangle: false,
            compress: {screw_ie8: true},//prod
            comments: false//prod

        })
    ],

    htmlLoader: {
        minimize: true,
        removeAttributeQuotes: false,
        caseSensitive: true,
        customAttrSurround: [[/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/]],
        customAttrAssign: [/\)?\]?=/]
    }

};
