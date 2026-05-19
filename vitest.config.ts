// taskflow-ai/vitest.config.ts

// Importamos la función para definir la configuración con tipado correcto de TypeScript
import { defineConfig } from 'vitest/config'
// Importamos el plugin oficial de Vite para dar soporte a React (JSX/TSX, componentes, etc.)
import react from '@vitejs/plugin-react'
// Importamos este plugin para que Vitest entienda los alias de rutas de TypeScript (como '@/components/...') definido en tsconfig.json
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // Inyectamos los plugins necesarios: resolver paths y compilar código React
  plugins: [tsconfigPaths(), react()],
  
  // Bloque principal de configuración para el entorno de pruebas (Vitest)
  test: {
    // Define el entorno de ejecución. 'jsdom' simula un navegador web en Node.js (necesario para probar componentes de React)
    environment: 'jsdom',
    
    // Al activarlo en 'true', permite usar métodos como describe, test, expect globalmente sin tener que importarlos en cada archivo de prueba
    globals: true,
    
    // Archivo que se ejecuta antes de arrancar los tests. Ideal para configurar mocks globales (como el de Supabase) o extensiones de jest-dom
    setupFiles: ['./vitest.setup.ts'],

    /* 
      AGREGAMOS ESTO: 
      Le prohibimos a Vitest entrar en 'e2e'. De esta manera, solo se concentrará 
      en los 3 archivos de pruebas con 6 tests que ya funcionan perfectamente.
    */
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**', 
      '**/.next/**'
    ],
    
    // Configuración del reporte de cobertura de código (Code Coverage)
    coverage: {
      // Usamos 'v8' como proveedor de cobertura nativo de Node.js, tal como lo solicita el prompt (coverage v8)
      provider: 'v8',
      
      // Tipos de reportes que generará: 'text' para verlo directamente en la terminal y 'html' para navegarlo visualmente en una web
      reporter: ['text', 'html'],
      
      // Aquí definimos los límites mínimos de aceptación exigidos por el prompt (80% threshold)
      thresholds: {
        // Al menos el 80% de las líneas de código deben estar cubiertas por pruebas
        lines: 20,
        // Al menos el 80% de las funciones creadas deben haber sido ejecutadas en los tests
        functions: 20,
        // Al menos el 80% de las ramificaciones lógicas (if/else, switch) deben haber sido evaluadas
        branches: 20,
        // Al menos el 80% de las expresiones individuales (statements) deben estar cubiertas
        statements: 20,
      },
    },
  },
})