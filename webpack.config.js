const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = { // moduleを定義
  mode: 'production',
  //entry: '', // gulpで設定
  output: {
    filename: '[name].min.js' // [name]はgulpで設定
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',// 古いブラウザでも機能させる為変換する
          options: {
            'presets': [
              ["@babel/preset-env"]
            ],
            'compact': false
          }
        },
      }
    ]
  },
  plugins: [
    // ファイルを分割しない
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  optimization: {
    minimize: true, // ファイル圧縮機能を有効にする
    minimizer: [
      new TerserPlugin({
        extractComments: false, // コメントを外部ファイルにしない
        terserOptions: {
          compress: {
            drop_console: false,  // console.logを残す
          }
        },
      }),
    ],
  },
  performance: {
    hints: false // パフォーマンス警告を表示しない
  },
  resolve: {
    extensions: ['.js']// 拡張子の省略
  }
}