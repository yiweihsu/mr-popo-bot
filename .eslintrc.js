module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ['eslint:recommended', 'prettier'],
  env: {
    node: true,
  },
  rules: {
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     trailingComma: 'es5',
    //     singleQuote: true,
    //   },
    // ],
    "semi": [2, "never"],
    "prefer-const": "error",
    "spaced-comment": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "no-console": ["error", { allow: ["warn", "error"] }]
  },
  plugins: ['prettier'],
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
};
