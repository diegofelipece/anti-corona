const path = require('path')
const ExtensionReloader = require('webpack-extension-reloader')
const ExtensionManifestPlugin = require('webpack-extension-manifest-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const baseManifest = require('./src/manifest')
const pkg = require('./package')

const PATHS = {
  APP: path.resolve(__dirname, './src'),
  DIST: path.resolve(__dirname, './dist'),
  DEMO: path.resolve(__dirname, './demo'),
}

module.exports = (env, argv) => {
  const isDevMode = argv.mode !== 'production'

  const config = {
    devtool: 'source-map',
    entry: {
      content: `${PATHS.APP}/content.js`,
      background: `${PATHS.APP}/background.js`,
    },
    output: {
      path: PATHS.DIST,
    },
    resolve: {
      extensions: ['.js'],
      modules: [
        PATHS.APP,
        'node_modules',
      ],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: PATHS.APP,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              outputPath: `${PATHS.DIST}/images`,
            },
          },
        },
      ],
    },
    plugins: [
      new ExtensionManifestPlugin({
        config: {
          base: baseManifest,
          extend: { version: pkg.version },
        },
      }),
      new CopyWebpackPlugin([
        {
          from: `${PATHS.APP}/images`,
          to: `${PATHS.DIST}/images`,
        },
      ]),
    ],
  }

  if (isDevMode) {
    config.plugins.push(
      new ExtensionReloader({
        port: 9090, // Which port use to create the server
        reloadPage: true, // Force the reload of the page also
        entries: {
          contentScript: 'content',
          background: 'background',
        },
      }),
    )
  }

  return config
}
