var path = require('path');
var webpack = require("webpack");
var helpers = require('./helpers');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var metadata = {
    baseUrl: '/',
    host: 'localhost',
    port: 3000
};

module.exports = {
    entry: [
        path.resolve('src/app/app')
    ],
    output: {
        path: path.resolve(__dirname, "www/out"),
        publicPath: "out/",
        filename: '[name].bundle.js'
    },


    debug: true,
    devtool: 'source-map',

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

    resolve: {
        //extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.html', '.css', '.json'],
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

    plugins: [

        new webpack.HotModuleReplacementPlugin(),

        // Plugin: OccurenceOrderPlugin
        // Description: Varies the distribution of the ids to get the smallest id length
        // for often used ids.
        // See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
        // See: https://github.com/webpack/docs/wiki/optimization#minimize
        new webpack.optimize.OccurenceOrderPlugin(true),

        new webpack.ProvidePlugin({

            jQuery: "jquery",
            $: "jquery",
            "window.jQuery": "jquery",

            _: "lodash",
            "window._": "lodash",

            moment: "moment",
            "window.moment": "moment"
        })
    ],

    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        stats: 'errors-only',
        port: metadata.port,
        host: metadata.host
    }
};