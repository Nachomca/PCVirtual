import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,  // O el puerto que prefieras
  },
  esbuild: {
    jsxInject: `import React from 'react'`, // Si estás usando JSX
  },
});
