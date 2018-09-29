const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const process = require('process')

const packageJson = require('./package.json')

const outputPath = path.resolve(__dirname, process.env.OUTPUT_PATH || 'dist')

module.exports = {
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, packageJson.main)
  ],
  output: {
    filename: 'artgen.js',
    path: outputPath
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: 'url-loader?limit=10000'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(outputPath),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }])
  ]
}
