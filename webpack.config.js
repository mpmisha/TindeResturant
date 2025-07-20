const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.module\.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isProduction
                    ? '[hash:base64:8]'
                    : '[name]__[local]--[hash:base64:5]',
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass-embedded'),
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          exclude: /\.module\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass-embedded'),
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash][ext]',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'TindeRestaurant',
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      port: 3000,
      open: true,
      hot: true,
      liveReload: false, // Disable live reload to prevent conflicts with HMR
      watchFiles: {
        paths: ['src/**/*'],
        options: {
          usePolling: false,
        },
      },
      historyApiFallback: {
        rewrites: [
          { from: /^\/restaurant\/.*$/, to: '/index.html' },
        ],
      },
      host: '0.0.0.0', // Allow access from mobile devices on the same network
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
        reconnect: 3,
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};
