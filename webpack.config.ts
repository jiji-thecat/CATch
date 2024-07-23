const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: {
      directory: './dist',
    },
  },
  watchOptions: {
    poll: 5000,
    ignored: ['/node_modules/'],
  },
  entry: ['/index.web.ts', '/styles.css'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[name][ext]',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'index.web.ts'),
          path.resolve(__dirname, 'node_modules/react-native'),
          path.resolve(__dirname, 'node_modules/@react-native'),
          path.resolve(__dirname, 'node_modules/@react-navigation'),
          path.resolve(__dirname, 'node_modules/expo-dev-menu/vendored/react-native-safe-area-context/src'),
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              // The 'metro-react-native-babel-preset' preset is recommended to match React Native's packager
              presets: ['module:metro-react-native-babel-preset'],
              // Re-write paths to import only the modules needed by the app
              plugins: ['react-native-web'],
            },
          },
          ,
          { loader: 'ts-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|gif)/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native-safe-area-context': 'expo-dev-menu/vendored/react-native-safe-area-context/src',
    },
    extensions: ['.ts', '.js', '.tsx', '.web.ts'],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: '/index.html',
      inject: 'body',
      scriptLoading: 'defer',
    }),
    new CopyPlugin({
      patterns: [{ from: 'assets', to: 'assets' }],
    }),
  ],
};
