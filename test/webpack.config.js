import path from 'path'

export default {
  target: 'node',
  entry: path.resolve(__dirname, './entry.js'),
  output: {
    path: __dirname,
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
      },
    ],
  },
}
