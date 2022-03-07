const path = require("path");
const webpack = require("webpack");
const sass = require("sass");

const { VueLoaderPlugin } = require("vue-loader");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const publicPath = path.resolve(__dirname, "public");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "/main.js",
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
  plugins: [new VueLoaderPlugin()],
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
  devServer: {
    static: publicPath,
    historyApiFallback: {
      index: "index.html"
    },
    compress: true,
    port: 8080
  },
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
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      })
    ]
  },
  devtool: "inline-source-map"
};

if (isProd) {
  module.exports.mode = "production";
  module.exports.devtool = false;
  // module.exports.plugins.push(
  //   new MiniCssExtractPlugin({
  //     filename: "[name].css",
  //     chunkFilename: "[id].css"
  //   })
  // );
}
