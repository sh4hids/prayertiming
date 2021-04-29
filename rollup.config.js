import { terser } from 'rollup-plugin-terser';

const pkgName = 'prayertiming';

export default [
  {
    input: 'src/main.js',
    plugins: [terser()],
    output: {
      file: `umd/${pkgName}.js`,
      format: 'umd',
      name: 'prayertiming',
      esModule: false,
    },
  },
  {
    input: {
      index: 'src/main.js',
      getByDay: 'src/getByDay.js',
      getByMonth: 'src/getByMonth.js',
    },
    plugins: [terser()],
    output: [
      {
        dir: 'esm',
        format: 'esm',
      },
      {
        dir: 'cjs',
        format: 'cjs',
        exports: 'auto',
      },
    ],
  },
];
