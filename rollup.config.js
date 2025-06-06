import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
    },
    plugins: [
      peerDepsExternal(),
      json(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        outDir: 'dist/cjs',
        declaration: true,
        declarationDir: 'dist/cjs/types',
      }),
      terser(),
    ],
    external: ['nodemailer', 'dotenv']
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
    },
    plugins: [
      peerDepsExternal(),
      json(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        outDir: 'dist/esm',
        declaration: true,
        declarationDir: 'dist/esm/types',
      }),
      terser(),
    ],
    external: ['nodemailer', 'dotenv']
  },
  {
    input: 'dist/cjs/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm', sourcemap: true, exports: 'named' }],
    plugins: [dts()],
  },
];
