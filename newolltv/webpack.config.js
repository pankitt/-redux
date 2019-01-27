const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const DashboardPlugin = require('webpack-dashboard/plugin');

const API_URL = process.env.API_URL;
const SOCKETS = process.env.SOCKETS ? JSON.stringify(process.env.SOCKETS.split(';')) : JSON.stringify(['k21-uit.dev.oll.tv']);
const plugins = [
    new webpack.DefinePlugin({
        API_URL: JSON.stringify(API_URL),
        'process.env': {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        },
        SOCKETS,
        GET_CDN_TOKEN_URL: JSON.stringify(process.env.GET_CDN_TOKEN_URL || 'https://ip.oll.tv/api/player/init'),
        BANKPUBLICKEY: JSON.stringify(process.env.BANKPUBLICKEY),
    }),
    new CopyWebpackPlugin([
        { from: 'ru', to: 'ru' },
        { from: 'uk', to: 'uk' },
        { from: 'promo/static', to: 'public/i/mail/' },
    ]),
    new HtmlWebpackPlugin({ template: 'index.html', hash: true, favicon: 'favicon.png', enviornment : process.env.NODE_ENV }),
];

// if (process.env.WEBPACK_DASHBOARD) {
//     plugins.push(new DashboardPlugin({ port: 3002 }));
// }

if (process.env.NODE_ENV === 'production') {
    console.log('NODE_ENV = ' + process.env.NODE_ENV);
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
            screw_ie8: true,
            keep_fnames: true,
        },
        compress: {
            warnings: false,
            screw_ie8: true,
            dead_code: true,
            evaluate: true,
            booleans: true,
            unused: true,
            collapse_vars: true,
            conditionals: true,
            reduce_vars: false,
        },
        comments: false,
        sourceMap: true,
    }));
}

const entry = {
    'app': ['babel-polyfill', './index'],
};

if (process.env.HRM) {
    entry.app.unshift('react-hot-loader/patch');
}

module.exports = {
    devtool: process.env.NODE_ENV === 'production'
        ? false
        : 'eval',
    entry,
    output: {
        path: path.resolve(__dirname, './dist/'),
        publicPath: '/',
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/(node_modules)/, path.resolve(__dirname, 'utils')],
                loader: 'babel-loader!eslint-loader',
            }, {
                test: /\.scss/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            }, {
                test: /\.(jpe?g|png|mp4)$/i,
                loaders: ['url-loader?limit=1024&name=i/[name].[ext]'],
            }, {
                test: /\.(eot|woff(2)?|ttf|svg)$/i,
                loaders: ['url-loader?limit=1024&name=fonts/[name].[ext]'],
            },
        ],
    },
    devServer: {
        overlay: {
            // warnings: true,
            errors: true,
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    plugins,
};
