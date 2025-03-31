/// <reference types="vitest" />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json',
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
      name: 'Renai',
      fileName: (format) => {
        if( format === 'cjs' ) {
          return 'renai.cjs';
        }
        if( format === 'es' ) {
          return 'renai.mjs';
        }

        return 'renai.js';
      },
      formats: ['es', 'umd', 'cjs']
    }
  },
  test: {

  }
})
