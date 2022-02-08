const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const PACKAGE = require("./package.json");

const version = PACKAGE.version;

module.exports = function (env) {
  const config = {
    entry: [
      path.resolve(__dirname, `src/styles/styles_${env.COLORSCHEME || "light"}.css`),
      path.resolve(__dirname, "src/index.ts"),
    ],
    output: {
      filename: `keyboard_${version}.js`,
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js", ".json", ".css"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "index.html",
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
        },
      }),
      new MiniCssExtractPlugin({
        filename: `keyboard_styles_${version}.css`,
      }),
    ],
    devServer: {
      static: path.resolve(__dirname, "public"),
      compress: true,
      historyApiFallback: true,
      port: 3000,
    },
  };

  return config;
};
