// @ts-nocheck

/**
 * Libraries
 */

const path = require('path');
const webpack = require('webpack');

/**
 * Plugins
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * Helpers
 */

const resolve = relative => path.resolve(__dirname, '../../', relative);
function stringify(object) {
    const temp = {};
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            temp[key] = JSON.stringify(object[key]);
        }
    }
    return temp;
}

/**
 * Constants
 */

const EVENT = process.env.npm_lifecycle_event || '';

/**
 * Determine if the build should be optimized
 */

const IS_SLIM = EVENT.includes(':slim');

/**
 * Determine if hot module replacement is enabled
 */

const IS_HMR = EVENT.includes(':hmr');

/**
 * Determine if visual mode is enabled. This means that the app will be bootstrapped
 * with all routing guards disabled, initially hydrated with mocked state and skipping
 * authorization during bootstrapping.
 */

const IS_VISUAL = EVENT.includes(':visual');

/**
 * Collecting the environemnt variables
 */

const ENVIRONMENT_VARIABLES = stringify({
    BABEL_ENV: IS_SLIM && 'production' || 'development',
    NODE_ENV: IS_SLIM && 'production' || 'development',
    VISUAL: IS_VISUAL
});

/**
 * Exporting configuration
 */

module.exports = function() {
    return {
        target: 'web',
        mode: IS_SLIM ? 'production' : 'development',
        devtool: IS_SLIM ? false : 'source-map',
        context: resolve('source/spa'),
        entry: {
            js: './index.js',
            vendor: [
                '@babel/polyfill',
                'react-dom',
                'react-redux',
                'react',
                'redux',
                'isomorphic-fetch'
            ]
        },
        output: {
            path: resolve('dist/spa'),
            publicPath: '/',
            filename: 'app.js'
        },
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            }, {
                test: /\.glsl$/,
                use: 'raw-loader'
            }, {
                test: /\.(json)/,
                type: 'javascript/auto',
                use: 'raw-loader'
            }, {
                test: /\.(png|gif|jpg|jpeg|svg|ico)$/,
                use: 'file-loader?name=[name].[ext]'
            }, {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }, {
                test: /\.css?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'postcss-loader'
                }
            }]
        },
        resolve: {
            extensions: [
                '.webpack-loader.js',
                '.web-loader.js',
                '.loader.js',
                '.js',
                '.jsx',
                '.scss',
                '.glsl'
            ],
            modules: [
                resolve('source'),
                resolve('source/common'),
                resolve('node_modules')
            ],
            alias: {
                common: resolve('source/common')
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': ENVIRONMENT_VARIABLES
            }),
            new webpack.NamedModulesPlugin(),
            new HtmlWebpackPlugin({
                template: resolve('source/spa/index.html'),
                path: resolve('dist/spa'),
                filename: 'index.html'
            }),
            new MiniCssExtractPlugin({
                filename: 'styles.css'
            }),
            new webpack.NormalModuleReplacementPlugin(
                /(.*)STORE_ENV(\.*)/,
                function(resource) {
                    if (IS_VISUAL) {
                        resource.request = resource.request.replace(/STORE_ENV/, 'visual');
                    } else {
                        resource.request = resource.request.replace(/STORE_ENV/, 'production');
                    }
                }
            ),
            ...(
                IS_HMR
                && [
                    new webpack.HotModuleReplacementPlugin()
                ] || []
            )
        ],
        resolveLoader: {
            alias: {
                SvgInline: 'svg-inline-loader?removeSVGTagAttrs=false',
                FileUrl: 'file-loader?name=[name].[ext]'
            }
        },
        stats: {
            colors: true,
            hash: false,
            version: true,
            timings: true,
            assets: true,
            chunks: false,
            modules: false,
            reasons: false,
            children: false,
            source: false,
            errors: true,
            errorDetails: true,
            warnings: false,
            publicPath: false
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'initial',
                        filename: 'vendor.js'
                    }
                }
            }
        },
        node: {
            fs: 'empty'
        },
        devServer: {
            contentBase: './source/spa',
            historyApiFallback: true,
            host: '0.0.0.0',
            port: 8080,
            compress: IS_SLIM,
            inline: !IS_SLIM,
            hot: IS_HMR,
            stats: {
                assets: false,
                children: false,
                chunks: false,
                hash: false,
                modules: false,
                publicPath: false,
                timings: true,
                version: true,
                warnings: false,
                colors: {
                    green: '\u001b[32m'
                }
            }
        }
    };
};
