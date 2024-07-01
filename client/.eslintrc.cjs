/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    commonjs: true
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/multi-word-component-names': 'off',
    'prefer-const': 'off',
    'no-var': 'error', // 要求使用 let 或 const 而不是 var
    '@typescript-eslint/no-unused-vars': 'warn', // 禁止定义未使用的变量
    'vue/no-mutating-props': 'error' // 不允许改变组件 prop
  }
}
