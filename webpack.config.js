const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require('dotenv').config();

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src/js/controllers/appController.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    static: { directory: path.join(__dirname, 'dist') },
    open: true,
    hot: false,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new FaviconsWebpackPlugin({ logo: 'public/imgs/logo.svg' }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    ...(isDev ? [] : [new MiniCssExtractPlugin()]),
    new CopyWebpackPlugin({ patterns: [{ from: 'public/imgs', to: 'imgs' }] }),
    new webpack.DefinePlugin({
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(
        process.env.GOOGLE_MAPS_API_KEY,
      ),
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
};
