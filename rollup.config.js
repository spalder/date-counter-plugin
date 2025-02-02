import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'main.ts',
  output: {
    file: 'main.js',
    format: 'cjs' // CommonJS format works well for Obsidian plugins.
  },
  plugins: [typescript()]
};

