const path = require('path');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
};

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

// Entry accepts a path or an object of entries. We'll use the latter
// since it's more convenient for complex configurations.
const common = {
  entry: {
    app: PATHS.app,
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        // regexp of files the loader applies to
        test: /\.css$/,
        loaders: ['style', 'css'],
        // accepts either a path or an array of paths
        include: PATHS.app,
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app,
      },
    ],
  },
};
// Default configuration. We will return this if
// Webpack is called outside of npm.
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true, // --save
      }),
    ],
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {});
}
