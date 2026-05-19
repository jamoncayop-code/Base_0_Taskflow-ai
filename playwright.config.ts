// taskflow-ai/playwright.config.ts

// Importamos las funciones necesarias de Playwright para definir la configuración y emular dispositivos reales
import { defineConfig, devices } from '@playwright/test'
// Importamos la función 'config' de dotenv renombrándola como 'loadEnv' para evitar colisiones de nombres
import { config as loadEnv } from 'dotenv'

// Cargamos las variables de entorno desde el archivo '.env.local' (donde Next.js suele guardar las llaves de Supabase)
// Esto permite que Playwright tenga acceso a las credenciales necesarias para los tests de autenticación
loadEnv({ path: '.env.local' })

export default defineConfig({
  // Define la carpeta raíz donde Playwright buscará exclusivamente tus pruebas de extremo a extremo (E2E)
  testDir: './e2e',
  
  // Ejecuta los archivos de prueba en paralelo para acelerar la velocidad total de la suite de pruebas
  fullyParallel: true,
  
  // Si estamos en un entorno de Integración Continua (CI), prohíbe que se ejecuten pruebas individuales marcadas con 'test.only'
  // Evita que por error subas un commit que bloquee o ignore el resto de las pruebas del sistema
  forbidOnly: !!process.env.CI,
  
  // Define cuántas veces se reintentará un test si falla de forma intermitente (flaky). 
  // En CI lo reintenta hasta 2 veces para descartar caídas de red temporales; localmente da 0 reintentos
  retries: process.env.CI ? 2 : 0,
  
  // REQUERIMIENTO DEL PROMPT: Configura el número de hilos simultáneos (workers)
  // En entornos CI lo limita estrictamente a 1 para no saturar el servidor de pruebas; localmente usa el valor por defecto (optimizado por CPU)
  workers: process.env.CI ? 1 : undefined,
  
  // Genera un reporte final interactivo en formato HTML para revisar paso a paso qué falló en una interfaz visual clara
  reporter: 'html',
  
  // Configuración global para todos los proyectos de navegación
  use: {
    // REQUERIMIENTO DEL PROMPT: Define la URL base de tu aplicación para no tener que escribir 'http://localhost:3000' en cada test
    baseURL: 'http://localhost:3000',
    
    // Captura capturas de pantalla, videos y logs de red ("trace") únicamente en el primer reintento de un test fallido
    trace: 'on-first-retry',
  },
  
  // REQUERIMIENTO DEL PROMPT: Levanta la aplicación de Next.js de forma automática antes de que arranquen las pruebas
  webServer: {
    // Comando para iniciar tu servidor local de desarrollo (el que configuramos en package.json)
    command: 'npm run dev',
    // URL que Playwright va a monitorear para saber con certeza que la aplicación ya está encendida y lista
    url: 'http://localhost:3000',
    // Localmente, si ya tienes la app corriendo en otra terminal, reutiliza esa sesión para ahorrar tiempo; en CI siempre inicia desde cero
    reuseExistingServer: !process.env.CI,
    // Tiempo máximo de espera (120 segundos) para que el servidor responda antes de cancelar las pruebas por timeout
    timeout: 120 * 1000,
  },
  
  // REQUERIMIENTO DEL PROMPT: Define los flujos secuenciales y navegadores donde se ejecutarán las pruebas
  projects: [
    {
      // PROYECTO 1: Configura el entorno inicial o "setup"
      name: 'setup',
      // Busca cualquier archivo que termine en '.setup.ts' (como tu e2e/auth.setup.ts) para ejecutarlo de primero
      testMatch: /.*\.setup\.ts/,
    },
    {
      // PROYECTO 2: El navegador donde se validará la aplicación del usuario
      name: 'chromium',
      use: {
        // Copia las configuraciones de pantalla y agente de un navegador Google Chrome de escritorio clásico
        ...devices['Desktop Chrome'],
        // REQUERIMIENTO DEL PROMPT: Guarda y reutiliza el estado de la sesión (cookies, tokens) desde este archivo JSON, 
        // evitando tener que rellenar el formulario de login al principio de cada test individual
        storageState: 'playwright/.auth/user.json',
      },
      // REQUERIMIENTO DEL PROMPT: Le dice a Playwright que no puede iniciar este proyecto sin que el proyecto 'setup' haya terminado con éxito
      dependencies: ['setup'],
    },
  ],
})