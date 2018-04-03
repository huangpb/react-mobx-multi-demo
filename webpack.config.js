const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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

    devServer: {
        contentBase: config.srcPath,
        port: config.port,
        historyApiFallback: true,
        inline: true,
        hot: true,
        proxy: {
            '/api/v1': {
                target: 'http://deadpool-dev.yeeuu.com',
                secure: false,
                changeOrigin: true
            }
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
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
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
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: 'js/vendor.[hash:8].js'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('develop')
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
        chunks: ['vendor', pathname]
    };

    module.exports.plugins.push(new HtmlWebpackPlugin(conf));
});
