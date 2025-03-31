/// <reference types="vitest" />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json'
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'renai-js',
      fileName: (format) => {
        if( format === 'cjs' ) {
          return 'index.cjs';
        }
        if( format === 'umd' ) {
          return 'index.umd.js';
        }

        return 'index.mjs';
      },
      formats: ['es', 'umd', 'cjs']
    },
    outDir: 'lib',
  },
  test: {

  }
})
