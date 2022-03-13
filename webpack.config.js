const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const process = require('process')

var config = {}

// function generateConfig(name) {
//   const compress = name.indexOf('min') > -1
//   const config = {
//     entry: './index.js',
//     output: {
//       filename: name + '.js',
//       path: resolve(__dirname, 'dist'),
//       sourceMapFilename: name + '.map',
//       library: 'axios_learn',
//       libraryTarget: 'umd',
//       globalObject: 'this'
//     },
//     devServer: {
//       static: {
//         directory: resolve(__dirname, '')
//       }
//     },
//     node: {
//       process: false
//     },
//     devtools: 'source-map',
//     mode: compress ? 'production' : 'development',
//     module: {
//       rules: [
//         {
//           test: /\.ts$/,
//           exclude: /node_modules/,
//           use: 'ts-loader'
//         }
//       ]
//     },
//     plugins: [
//       new HtmlWebpackPlugin({
//         template: 'example/index.html',
//         minify: false,
//         filename: name + '.html'
//       })
//     ],
//     resolve: {
//       extensions: ['.ts', '.js']
//     }
//   }
//   return config
// }

// ['axios_learn', 'axios_learn_min'].forEach((key) => {
//   config[key] = generateConfig(key)
// })

// module.exports = config
module.exports = (env) => {
  const isDev = env.development
  const options = {
    filename: isDev ? 'axios_learn' : 'axios_learn.min',
    mode: isDev ? 'development' : 'production'
  }
  return {
    target: 'web',
    entry: './index.js',
    output: {
      filename: options.filename + '.[name].[contenthash].bundle.js',
      path: resolve(__dirname, 'dist'),
      sourceMapFilename: options.filename + '.[name].[contenthash].bundle.map',
      clean: true,
      library: 'myLib',
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    devServer: {
      static: {
        directory: resolve(__dirname, '')
      }
    },
    devtool: 'source-map',
    mode: options.mode,
    node: {
      global: true
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: 'ts-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'example/index.html',
        minify: false
      })
    ],
    resolve: {
      extensions: ['.ts', '.js']
    }
  }
}