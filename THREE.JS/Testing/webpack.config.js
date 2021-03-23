 const path = require('path')
 const miniCssExtractPlugin = require('mini-css-extract-plugin')
 const htlWebpackPlugin = require("html-webpack-plugin")
 const {CleanWebpackPlugin} =require ("clean-webpack-plugin")


 let mode = "development"

 if (process.env.NODE_ENV === "production") {
     mode = "production"
 }


 module.exports = {
     mode,
     devtool: "source-map",
     entry: {
         main: path.resolve(__dirname, './src/script.js'),
     },
     output: {
         path: path.resolve(__dirname, './dist'),
         filename: 'bundle.js',
         assetModuleFilename:"img/[hash][ext]"
     },
     devServer: {
         contentBase: './dist',
        // hot: true,
         open: true,
     },
     module: {
         rules: [{
                 test: /\.js$/,
                 exclude: /node_modules/,
                 use: {
                     loader: "babel-loader"
                 }
             },
             {
                 test: /\.s?css$/i,
                 use: [{
                         loader: miniCssExtractPlugin.loader,
                         options: { publicPath: ""},
                     },
                     "css-loader",
                     "sass-loader"
                 ]
             },
             {
                 test: /\.(png|jpe?g|gif|svg)$/i,
                 type: "asset"
             },
             //glsl
            {
                test:/\.(glsl|vs|fs|vert|frag)$/,
                exclude:/node_module/,
                use:['raw-loader']
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