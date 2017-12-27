const nodeResolver = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const json = require('rollup-plugin-json');
const string = require('rollup-plugin-string');

const banner = `
/*!
 * Copyright 2018, nju33
 * Released under the MIT License
 * https://github.com/nju33/tner
 */
`.trim();

const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = {
  banner,
  cache: null,
  input: 'lib/tner.js',
  plugins: [
    nodeResolver({jsnext: true}),
    commonjs({include: 'node_modules/**'}),
    babel({include: 'lib/**/*.js', runtimeHelpers: true}),
    replace({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv)
    }),
    json({include: 'lib/**/*.json'}),
    string({include: 'lib/**/*.css'})
  ]
};
