const pathLib = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const ROOT_PATH = pathLib.resolve(__dirname);
const ENTRY_PATH = pathLib.resolve(ROOT_PATH, 'src');
const OUTPUT_PATH = pathLib.resolve(ROOT_PATH, 'build');
const AppHtml = pathLib.resolve(ENTRY_PATH,'index.html')
console.log(pathLib.resolve(ENTRY_PATH, 'index.js'));

module.exports = {
    entry: {
        index: ['babel-polyfill',pathLib.resolve(ENTRY_PATH, 'index.js')],
        vendor: ['react', 'react-dom', 'react-router-dom']
    },
    output: {
        path: OUTPUT_PATH,
        publicPath: './',
        filename: '[name]-[chunkhash].js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]-[local]-[hash:base64:5]',
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                use: ['style-loader',
                    {
                        loader: 'css-loader'
                    },
                    'postcss-loader'
                ]
            },
            // {
            //     test: /\.less$/,
            //     use: ["style-loader", 'css-loader', "postcss-loader", "less-loader"]
            // },
            {
                test: /\.less$/,
                use: [{
                  loader: 'style-loader',
                }, {
                  loader: 'css-loader', // translates CSS into CommonJS
                }, {
                    // loader: 'less-loader',
                    // options: {
                    // modifyVars: aliyunTheme,
                  loader: 'less-loader', // compiles Less to CSS
                 options: {
                   modifyVars: {
                     'primary-color': '#D228E9',
                     'link-color': '#1DA57A',
                     'border-radius-base': '2px',
                //     'primary-color': '#d228e9',                        // primary color for all components
                //     'link-color': '#1890ff',                            // link color
                //     'success-color': '#52c41a',                     // success state color
                //     'warning-color': '#faad14',                        // warning state color
                //     'error-color': '#f5222d',                          // error state color
                //     'font-size-base': '40px',                           // major text font size
                //     'heading-color': 'rgba(0, 0, 0, .85)',              // heading text color
                //     'text-color': 'rgba(0, 0, 0, .65)',                // major text color
                //     'text-color-secondary' : 'rgba(0, 0, 0, .45)',      // secondary text color
                //     'disabled-color' : 'rgba(0, 0, 0, .25)',            // disable state color
                //     'border-radius-base': '4px',                        // major border radius
                //     'border-color-base': '#d9d9d9',                     // major border color
                //     'box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)'  // major shadow for layers
                     
                  },
                   javascriptEnabled: true,
                 },
                }],
                // ...other rules
              },
            {
                test: /\.(png|jpg|gif|JPG|GIF|PNG|BMP|bmp|JPEG|jpeg)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.(eot|woff|ttf|woff2|svg)$/,
                use: 'url-loader'
            }
        ]
    },
    plugins: [
        new CleanPlugin(['build']),
        new ProgressBarPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),//改善chunk传输
        new webpack.DefinePlugin({
            "progress.env.NODE_ENV": JSON.stringify('production')
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: AppHtml,
        }),
        new webpack.NoEmitOnErrorsPlugin(),//保证出错时页面不阻塞，且会在编译结束后报错
        new ExtractTextPlugin({
            filename:'bundle.[contenthash].css',
            disable:false,
            allChunks:true
        }),
        new webpack.HashedModuleIdsPlugin(),//用 HashedModuleIdsPlugin 可以轻松地实现 chunkhash 的稳定化
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest"
        })
    ],
    resolve: {
        extensions: ['.js', '.json', '.sass', '.scss', '.less', 'jsx']
    }
};
