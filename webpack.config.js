import CopyPlugin from "copy-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/client/Main.ts",
    output: {
      publicPath: isProduction ? "/King-War/" : "/",
      filename: "js/[name].[contenthash].js",
      path: path.resolve(__dirname, "dist"),
      clean: isProduction,
    },
    module: {
      rules: [
        {
          test: /\.bin$/,
          type: "asset/resource",
          generator: {
            filename: "binary/[name].[contenthash][ext]",
          },
        },
        {
          test: /\.txt$/,
          type: "asset/resource",
          generator: {
            filename: "text/[name].[contenthash][ext]",
          },
        },
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: ["tailwindcss", "autoprefixer"],
                },
              },
            },
          ],
        },
        {
          test: /\.(webp|png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
          generator: {
            filename: "images/[name].[contenthash][ext]",
          },
        },
        {
          test: /\.html$/,
          use: ["html-loader"],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: "asset/resource",
          generator: {
            filename: "fonts/[name].[contenthash][ext]",
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "protobufjs/minimal": path.resolve(
          __dirname,
          "node_modules/protobufjs/minimal.js",
        ),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/client/index.html",
        filename: "index.html",
        minify: isProduction
          ? {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            }
          : false,
      }),
      new webpack.DefinePlugin({
        "process.env.WEBSOCKET_URL": JSON.stringify(
          isProduction ? "" : "localhost:3000",
        ),
      }),
      new webpack.DefinePlugin({
        "process.env.GAME_ENV": JSON.stringify(isProduction ? "prod" : "dev"),
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "resources"),
            to: path.resolve(__dirname, "dist"),
            noErrorOnMissing: true,
          },
          {
            from: path.resolve(__dirname, "src/client/privacy-policy.html"),
            to: path.resolve(__dirname, "dist/privacy-policy.html"),
          },
          {
            from: path.resolve(__dirname, "src/client/terms-of-service.html"),
            to: path.resolve(__dirname, "dist/terms-of-service.html"),
          },
          {
            from: path.resolve(__dirname, "src/client/manifest.json"),
            to: path.resolve(__dirname, "dist/manifest.json"),
          },
        ],
        options: { concurrency: 100 },
      }),
      new ESLintPlugin({
        context: __dirname,
      }),
    ],
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
    devServer: isProduction
      ? {}
      : {
          devMiddleware: { writeToDisk: true },
          static: {
            directory: path.join(__dirname, "dist"),
          },
          historyApiFallback: true,
          compress: true,
          port: 9000,
          proxy: [
            {
              context: ["/socket"],
              target: "ws://localhost:3000",
              ws: true,
              changeOrigin: true,
              logLevel: "debug",
            },
            {
              context: ["/w0"],
              target: "ws://localhost:3001",
              ws: true,
              secure: false,
              changeOrigin: true,
              logLevel: "debug",
            },
            {
              context: ["/w1"],
              target: "ws://localhost:3002",
              ws: true,
              secure: false,
              changeOrigin: true,
              logLevel: "debug",
            },
            {
              context: ["/w2"],
              target: "ws://localhost:3003",
              ws: true,
              secure: false,
              changeOrigin: true,
              logLevel: "debug",
            },
            {
              context: ["/w0"],
              target: "http://localhost:3001",
              pathRewrite: { "^/w0": "" },
              secure: false,
              changeOrigin: true,
              logLevel: "debug",
            },
            {
              context: ["/w1"],
              target: "http://localhost:3002",
              pathRewrite: { "^/w1": "" },
              secure: false,
              changeOrigin: true,
              logLevel: "debug",
            },
            {
              context: ["/w2"],
              target: "http://localhost:3003",
              pathRewrite: { "^/w2": "" },
              secure: false,
              changeOrigin: true,
              logLevel: "debug",
            },
            {
              context: [
                "/api/env",
                "/api/game",
                "/api/public_lobbies",
                "/api/join_game",
                "/api/start_game",
                "/api/create_game",
                "/api/archive_singleplayer_game",
                "/api/auth/callback",
                "/api/auth/discord",
                "/api/kick_player",
              ],
              target: "http://localhost:3000",
              secure: false,
              changeOrigin: true,
            },
          ],
        },
  };
};
