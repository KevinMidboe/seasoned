const path = require("path");
const webpack = require("webpack");
const sass = require("sass");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const TerserPlugin = require("terser-webpack-plugin");

const sourcePath = path.resolve(__dirname, "src");
const indexFile = path.join(sourcePath, "index.html");
const javascriptEntry = path.join(sourcePath, "main.js");
const publicPath = path.resolve(__dirname, "public");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: process.env.NODE_ENV,
  context: publicPath,
  entry: javascriptEntry,
  output: {
    path: `${publicPath}/dist/`,
    publicPath: "/dist/",
    filename: "[name].[contenthash].js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        },
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          "vue-style-loader",
          // isProd ? MiniCssExtractPlugin.loader : "vue-style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]"
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HTMLWebpackPlugin({
      template: indexFile,
      filename: "index.html",
      minify: isProd
    })
  ],
  resolve: {
    extensions: [".js", ".vue", ".json", ".scss"],
    alias: {
      vue$: "vue/dist/vue.common.js",
      "@": path.resolve(__dirname, "src"),
      src: path.resolve(__dirname, "src"),
      assets: `${publicPath}/assets`,
      components: path.resolve(__dirname, "src/components")
    }
  },
  devtool: "source-map",
  performance: {
    hints: false
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace("@", "")}`;
          }
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          sourceMap: true
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      })
    ]
  },
  devServer: {
    static: publicPath,
    historyApiFallback: {
      index: "/dist/index.html"
    },
    compress: true,
    hot: true,
    port: 8080
  }
};

if (isProd) {
  module.exports.mode = "production";
  module.exports.devtool = false;
  module.exports.performance.hints = "warning";
}

// enable proxy by running command e.g.:
// proxyhost=https://request.movie yarn dev
const { proxyhost } = process.env;
if (proxyhost) {
  module.exports.devServer.proxy = {
    "/api": {
      target: proxyhost,
      changeOrigin: true
    }
  };
}
