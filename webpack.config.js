// Node.js модуль для работы с путями
const path = require("path");
// Подключит получившийся bundle.js в HTML
const HtmlWebpackPlugin = require("html-webpack-plugin");
// Перед каждой сборкой удаляет папку dist
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  // Начинает аналз зависимостей отсюда
  entry: "./src/index.ts",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  module: {
    rules: [
      {
        // Применить это правило ко всем файлам, которые заканчиваются на .ts
        test: /\.ts$/,
        // Webpack не должен перекомпилировать библиотеки
        exclude: /node_modules/,
        // Engine.ts ↓ Engine.js
        use: "ts-loader",
      },

      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [
    // Добавит в HTML <script src="./bundle.js"></script>
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "WebGL Showcase",
    }),
    // При каждом запуске удаляет страрые бандлы
    new CleanWebpackPlugin(),
  ],

  // Это позволит браузеру показывать ошибки именно в Engine.ts
  devtool: "source-map",

  devServer: {
    static: "./dist",
    port: 8080,
    open: true,
    // Webpack попытается обновить только изменившиеся модули
    hot: true,
    // Включает gzip-сжатие ответов локального сервера
    compress: true,
  },
};
