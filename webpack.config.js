const path = require('path');

module.exports = {
  entry:[
    "babel-polyfill", "./src/app.js"
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js?/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['env', 'stage-2'],
        plugins: [
          ['transform-react-jsx', {
            pragma: 'Harmony.createElement'
          }]
        ]
      }
    }]
  }
}
