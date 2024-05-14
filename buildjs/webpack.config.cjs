/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

//require child_process
const childProcess = require("child_process");
const path = require("path");

const mode = process?.env?.NODE_ENV || "production";
const publicPath = "/"; //打包根目录

//webpack配置
const webpackConfig = {
  entry: {
    index: path.resolve(__dirname, "index.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    clean: true,
  },
  mode: mode != "development" ? "production" : "development",
  devtool: mode != "development" ? false : "eval-source-map",
  optimization: {
    splitChunks: {
      chunks: "all", // 'all' 可以更细致地控制，但这里我们不想要任何代码分割
      minSize: Infinity, // 通过设置非常大的 minSize 可以防止创建额外的块
    },
    runtimeChunk: false
  },
  plugins: [new NodePolyfillPlugin()],
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      {
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                },
              ],
              "@babel/preset-typescript",
            ],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
        test: /\.(js|jsx|ts)$/,
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json", ".jsx"],
    alias: {
      //'@': path.resolve(__dirname, 'src/'),
    },
    fallback: {
      fs: false,
    },
  },
};

module.exports = webpackConfig;
