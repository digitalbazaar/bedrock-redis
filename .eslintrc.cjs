module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'digitalbazaar',
    'digitalbazaar/jsdoc',
    'digitalbazaar/module'
  ],
  ignorePatterns: ['node_modules/'],
  rules: {
    'unicorn/prefer-node-protocol': 'error'
  }
};