module.exports = function(api) {
  api.cache(true);
  return {
    presets: [['@babel/preset-env', {targets: {node: 'current'}}], 'babel-preset-expo', '@babel/preset-typescript'],
    plugins: [
      ["module:react-native-dotenv"],
      ["@babel/plugin-transform-class-properties", { "loose": true }],
      ["@babel/plugin-transform-private-methods", { "loose": true }],
      ["@babel/plugin-transform-private-property-in-object", { "loose": true }]
    ]
  };
};
