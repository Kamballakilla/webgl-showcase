// Node.js модуль для работы с путями
import path from "path";
import { fileURLToPath } from 'url';
// Подключит получившийся bundle.js в HTML
import HtmlWebpackPlugin from "html-webpack-plugin";
// Перед каждой сборкой удаляет папку dist
import { CleanWebpackPlugin } from "clean-webpack-plugin";

// Получаем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development",
  // Начинает анализ зависимостей отсюда
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
        // Engine.ts → Engine.js
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
    // При каждом запуске удаляет старые бандлы
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