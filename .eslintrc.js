module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    // "standard",
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:prettier/recommended'
  ],
  plugins: ['babel', 'prettier', 'vue'],
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint'
  },
  rules: {
    'no-debugger': 'off',
    // 使用console很常见，并且webpack会drop_console
    'no-console': 'off',
    // 允许 !! 运算，原本不允许
    'no-extra-boolean-cast': 'off',
    'prettier/prettier': 'off',

    // v-for当中要是用v-if，只能使用for的元素作为条件
    'vue/no-use-v-if-with-v-for': [
      'error',
      {
        allowUsingIterationVar: true // default: false
      }
    ],
    // 忽略 template 中的三元运算符使用小于号（<）时报错
    'vue/no-parsing-error': [
      2,
      {
        'x-invalid-end-tag': false,
        'invalid-first-character-of-tag-name': false
      }
    ],
    // 下面2个都要求是error的，但是暂时没办法改，所以先妥协
    'vue/no-side-effects-in-computed-properties': 'warn',
    'vue/no-async-in-computed-properties': 'warn'
  },
  globals: {
    noCaptcha: true, // 两个都是阿里云的验证组件
    NoCaptcha: true,
    wx: true, // 微信
    monitor: true, // 监控库
    WeixinJSBridge: true, // 微信
    process: true //main.js的全局开启console,
  }
}
