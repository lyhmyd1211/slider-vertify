const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
//功能已更新，与官网文档不同

module.exports = {
  entry: 
    ["babel-polyfill",'./index.js']
    ,
    output: {
        filename: 'slider-vertify.min.js',
        path: path.resolve(__dirname, 'dist'),
        environment: {
          arrowFunction: false,//关闭箭头函数输出
        },
    },
  plugins: [
            
            
  ],
  module: {
      rules: [
        //css配置
        //安装了style-loader css-loader方可配置
          {
              test: /\.css$/,
              use: [
                  'style-loader',
                  'css-loader'
              ]
          },
        //图片和字体文件配置
        //安装了file-loader方可配置
          {
              test: /\.(png|svg|jpg|gif)$/,
              use: ['file-loader']
          },
          {
              test: /\.(woff|woff2|eot|ttf|otf)$/,
              use: [
                  'file-loader'
              ]
          },
          {
            test: '/\.js$/',
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }
      ]
  },
};