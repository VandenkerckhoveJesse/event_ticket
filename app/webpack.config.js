const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/organize/index.html", to: "organize/index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/redeem/index.html", to: "redeem/index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/manage/index.html", to: "manage/index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/manage/kiosk/index.html", to: "manage/kiosk/index.html" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
