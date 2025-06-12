const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');



module.exports = {
  entry: './src/main.ts', // your entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // output folder
    clean: true, // clean dist folder on every build
  },
  resolve: {
    extensions: ['.ts', '.js'], // resolve TypeScript and JS
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, 
        type: 'assets/resource',
      },
    ],
  },
  devServer: {
    static: './dist', // serve files from dist
    hot: true,
    port: 3000,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            //context: path.join(__dirname, 'your-app'),
          }
        ]
      }),
  ],
  mode: 'development', // change to 'production' for production build
};
