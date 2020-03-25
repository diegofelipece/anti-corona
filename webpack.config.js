const path = require('path')
const ExtensionReloader = require('webpack-extension-reloader')

const PATHS = {
  APP: path.resolve('src/'),
  DIST: path.resolve('dist/'),
  DEMO: path.resolve('demo/'),
}

module.exports = {
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
    ],
  },
  plugins: [
    new ExtensionReloader({
      port: 9090, // Which port use to create the server
      reloadPage: true, // Force the reload of the page also
      entries: {
        contentScript: 'content',
        background: 'background',
      },
    }),
  ],
}
