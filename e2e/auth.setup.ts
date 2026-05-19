// taskflow-ai/e2e/auth.setup.ts

// Importamos las herramientas de Playwright. 
// Renombramos 'test' como 'setup' para dejar claro visualmente que este archivo no es un test común, sino una configuración previa.
import { test as setup, expect } from '@playwright/test'

// Definimos la ruta de destino donde se guardará el "estado de la sesión" (cookies, tokens, localStorage) en un archivo JSON.
// Esta ruta coincide exactamente con la que configuramos en 'playwright.config.ts'.
const authFile = 'playwright/.auth/user.json'

// Declaramos el bloque de inicialización llamado 'authenticate'
setup('authenticate', async ({ page }) => {
  // Extraemos de forma segura las credenciales de prueba guardadas en tu archivo local '.env.local'
  const email = process.env.E2E_EMAIL
  const password = process.env.E2E_PASSWORD

  // Guardraíl de seguridad: Si olvidaste configurar las variables de entorno, detenemos el proceso inmediatamente
  // con un mensaje claro en lugar de mandar valores vacíos y esperar a que el formulario falle por error de clave.
  if (!email || !password) {
    throw new Error('Faltan E2E_EMAIL y/o E2E_PASSWORD en variables de entorno')
  }

  // REQUERIMIENTO DEL PROMPT: Navega a la página de inicio de sesión.
  // Gracias al 'baseURL' configurado en Playwright, bastará con poner '/login' en lugar de toda la URL completa.
  await page.goto('/login')



  // // REQUERIMIENTO DEL PROMPT (Selectores accesibles): 
  // // Busca el elemento que tenga una etiqueta asociada (<label>) que contenga "correo electrónico" o "email" (sin importar mayúsculas gracias a la 'i')
  // // y simula que el usuario escribe el correo del archivo .env.local.
  // await page.getByLabel(/correo electrónico|email/i).fill(email)

  // // Hace exactamente lo mismo que el paso anterior, pero localizando la etiqueta "contraseña" o "password" para escribir la clave.
  // await page.getByLabel(/contraseña|password/i).fill(password)

  // // REQUERIMIENTO DEL PROMPT (Selectores accesibles):
  // // Busca un elemento interactivo que sea un botón ('button') cuyo texto visible contenga "iniciar sesión", "sign in" o "login".
  // // Una vez localizado, hace un clic del ratón sobre él.
  // await page
  //   .getByRole('button', { name: /iniciar sesión|sign in|login/i })
  //   .click()

  // // CONTROL DE FLUJO: Espera pacientemente a que la URL del navegador cambie y contenga la palabra 'dashboard'.
  // // Esto nos asegura que el servidor (Supabase API) procesó el login correctamente y nos dio acceso a la app.
  // await expect(page).toHaveURL(/dashboard/)



  /* 
    NUEVO / AGREGADO: 
    Le decimos a Playwright que espere explícitamente a que el navegador termine de cargar la URL.
    Esto evita que intente buscar elementos en una pantalla que aún se está cargando.
  */
  await page.waitForURL('**/login')

  /* 
    CORREGIDO: Cambiamos 'page.getByLabel()' por 'page.locator()'.
    Usar '#email' y '#password' busca directamente por el ID único que pusimos en tu HTML.
    ¡Esto es 100% infalible en cualquier sistema operativo y evita problemas con los textos de los labels!
  */
  // Rellenar el correo electrónico
  await page.locator('#email').fill(email)

  // Rellenar la contraseña
  await page.locator('#password').fill(password)

  /*
    CORREGIDO: Para el botón, en lugar de buscar por un texto exacto que pueda variar,
    buscamos el botón de tipo submit del formulario, que es único en esta página.
  */
  // Hacer clic en el botón de iniciar sesión
  await page.locator('button[type="submit"]').click()

  // Esperar a que la aplicación nos redirija al Dashboard tras un login exitoso
  await page.waitForURL('**/dashboard')





  // REQUERIMIENTO DEL PROMPT (storageState):
  // Una vez logueados con éxito, extraemos las cookies de autenticación de Supabase y el estado de la sesión actual 
  // y lo guardamos físicamente en el archivo 'playwright/.auth/user.json'.
  await page.context().storageState({ path: authFile })
})