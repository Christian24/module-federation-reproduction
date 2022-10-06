const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
const path = require("path");
const app2Config = require("../app2/webpack.config.js");
const app3Config = require("../app3/webpack.config.js");

module.exports = [
  {
    entry: "./src/index",
    mode: "development",
    devServer: {
      static: path.join(__dirname, "dist"),
      port: 3001,
    },
    output: {
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "app1",
        remotes: {
          app2: "app2@localhost:3001/app2/remoteEntry.js",
          app3: "app3@localhost:3001/app3/remoteEntry.js",
        },
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
        },
      }),
      new ExternalTemplateRemotesPlugin(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
  },
  app2Config,
  app3Config,
];
