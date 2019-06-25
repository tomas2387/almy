import { terser } from 'rollup-plugin-terser';

export default [{
  input: 'almy.js',
  plugins: [terser()],
  output: [
    {
      compact: true,
      name: 'almy',
      file: 'dist/almy.umd.js',
      format: 'umd',
      strict: false,
      esModule: false
    },
    {
      file: 'dist/almy.cjs.js',
      format: 'cjs',
      compact: true,
      strict: false,
      esModule: false
    },
    {
      file: 'dist/almy.esm.js',
      format: 'esm',
      compact: true
    }
  ]
}];