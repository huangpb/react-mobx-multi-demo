const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('./config');


let getEntry = (globPath) => {
    let entries = {
        vendor: ['react', 'react-dom', 'mobx', 'mobx-react', 'reqwest']
    }
    glob.sync(globPath).forEach(function(entry) {
        let pathname = entry.split('/').slice(-2,-1);
        entries[pathname] = ['react-hot-loader/patch', entry];
    });

    return entries;
}

const isProduction = process.env.NODE_ENV === 'production';
let entries = getEntry('./src/pages/*/index.js');
const chunks = Object.keys(entries);
console.log(process.env.NODE_ENV)


module.exports = {
    devtool: 'source-map',

    entry: entries,

    output: {
        path: config.distPath,
        filename: isProduction ? "js/[name].[hash:8].js" : "js/[name].bundle.js",
    },

    resolve: {
        alias: {
            '@': config.srcPath
        }
    },

    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            },
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                })
            },
            {
                test: /\.(png|gif|jpg|jpeg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'img/'
                    }
                }
            },
            {
                test: /\.(eot|svg|ttf|woff)?$/,
                loader: 'url-loader'

            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('css/[name].[hash:8].css'),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: false
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: 'js/vendor.[hash:8].js'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.ProvidePlugin({
            lodash: 'lodash'
        })
    ]
};

chunks.forEach(function(pathname) {
    if (pathname === 'vendor') {
        return;
    }
    const conf = {
        favicon: path.resolve(config.srcPath, 'favicon.ico'),
        title: config.titles[pathname],
        inject: 'body',
        filename: path.resolve(config.distPath, pathname + '.html'),
        template: path.join(config.srcPath, 'pages', pathname, 'index.tmpl.html'),
        chunks: ['vendor', pathname],
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
    };

    module.exports.plugins.push(new HtmlWebpackPlugin(conf));
});
