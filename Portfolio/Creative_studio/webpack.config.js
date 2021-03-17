const path = require('path')
const autoprefixer = require('autoprefixer');
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const htlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} =require ("clean-webpack-plugin")


let mode = "development"

if (process.env.NODE_ENV === "production") {
    mode = "production"
}

module.exports = {
    mode,
    devtool:'source-map',
    entry:{
        main:path.resolve(__dirname, './src/script.js')
    }, 
    output:{
        path:path.resolve(__dirname, './dist'),
        filename:'[name].bundle.js',
        assetModuleFilename:'img/[hash][ext]'
    },
    devServer: {
        contentBase: './dist',
       // hot: true,
        open: true,
    },
    module:{
        rules:[
            //изображения
            {
                test:/\.(?:ico|gif|png|jpg|jpeg)$/i,
                type:'asset'
            },
            //шрифты
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{ 
                    loader:"babel-loader"
                }
            },
            //scss
            {
                test: /\.s?css$/i,
                use: [{
                        loader: miniCssExtractPlugin.loader,
                        options: { publicPath: ""},
                    },
                    {
                        loader:'css-loader'

                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new miniCssExtractPlugin(),
        new htlWebpackPlugin({
            template:"./src/index.html"
        })
    ]

}

