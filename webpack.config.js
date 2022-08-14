const path = require("path");
const webpack = require("webpack");
const sass = require("sass");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const TerserPlugin = require("terser-webpack-plugin");
const dotenv = require("dotenv").config({ path: "./.env" });
const dotenvExample = require("dotenv").config({ path: "./.env.example" });

const sourcePath = path.resolve(__dirname, "src");
const indexFile = path.join(sourcePath, "index.html");
const javascriptEntry = path.join(sourcePath, "main.ts");
const publicPath = path.resolve(__dirname, "public");
const isProd = process.env.NODE_ENV === "production";
const variables = dotenv.parsed || dotenvExample.parsed;

// Merge inn all process.env values that match dotenv keys
Object.keys(process.env).forEach(key => {
  if (key in variables) {
    variables[key] = process.env[key];
  }
});

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
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
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
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(variables)
    })
  ],
  resolve: {
    extensions: [".js", ".ts", ".vue", ".json", ".scss"],
    alias: {
      vue: "@vue/runtime-dom",
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

// enable proxy for anything that hits /Api
// View README or update src/config.ts:SEASONED_API_URL
const { SEASONED_API } = process.env;
if (SEASONED_API) {
  module.exports.devServer.proxy = {
    "/api": {
      target: SEASONED_API,
      changeOrigin: true
    }
  };
}
