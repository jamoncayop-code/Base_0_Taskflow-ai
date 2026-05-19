// taskflow-ai/e2e/login.spec.ts

// Importamos las funciones estándar de Playwright para estructurar y ejecutar pruebas funcionales
import { test, expect } from '@playwright/test'

// Agrupamos bajo un bloque descriptivo todas las pruebas relacionadas exclusivamente con la página de login
test.describe('login page', () => {
  
  /* 
    MUY IMPORTANTE: Por defecto, en 'playwright.config.ts' configuramos que TODO el navegador 
    use la sesión ya guardada en 'user.json'. 
    Sin embargo, para probar la página de login NECESITAMOS simular un usuario que NO está autenticado.
    Esta línea limpia las cookies y los orígenes del almacenamiento local solo para este bloque de pruebas,
    reemplazando el comportamiento global.
  */
  test.use({ storageState: { cookies: [], origins: [] } })

  // PRUEBA 1: Verifica que la interfaz gráfica cargue correctamente con sus elementos base
  test('muestra la página de login', async ({ page }) => {
    // Navega a la ruta de inicio de sesión
    await page.goto('/login')

    // REQUERIMIENTO DEL PROMPT (Selectores accesibles): Valida que los inputs con etiquetas semánticas existan y se muestren en pantalla
    await expect(page.getByLabel(/correo electrónico|email/i)).toBeVisible()
    await expect(page.getByLabel(/contraseña|password/i)).toBeVisible()
    
    // Valida que el botón principal de acción también sea visible para el usuario común
    await expect(
      page.getByRole('button', { name: /iniciar sesión|sign in|login/i })
    ).toBeVisible()
  })

  // PRUEBA 2: Verifica el camino del fallo (Negative Testing) y la respuesta del sistema
  test('muestra error con credenciales inválidas', async ({ page }) => {
    await page.goto('/login')

    // Simulamos que un usuario escribe credenciales ficticias o erróneas en el formulario
    await page.getByLabel(/correo electrónico|email/i).fill('fake@example.com')
    await page.getByLabel(/contraseña|password/i).fill('wrong-password')
    
    // Hacemos clic en el botón de enviar formulario
    await page
      .getByRole('button', { name: /iniciar sesión|sign in|login/i })
      .click()

    // Control de UI: Esperamos que la interfaz renderice algún mensaje de error o alerta que coincida con estas palabras clave
    await expect(page.getByText(/credenciales incorrectas|invalid|incorrect|error/i)).toBeVisible()
  })

  // PRUEBA 3: Verifica el flujo exitoso (Happy Path) del proceso de autenticación manual
  test('redirecciona al dashboard con credenciales válidas', async ({ page }) => {
    // Extraemos las credenciales reales de prueba desde las variables de entorno
    const email = process.env.E2E_EMAIL
    const password = process.env.E2E_PASSWORD

    // Guardraíl en los tests: Si por alguna razón no se configuraron las variables, en lugar de romper el test con error, 
    // le dice a Playwright que lo "salte" (skip) de forma elegante informando la causa en consola.
    test.skip(!email || !password, 'Faltan credenciales E2E')

    await page.goto('/login')

    // Rellenamos el formulario usando el operador '!' para garantizar a TypeScript que sabemos que las variables no son nulas
    await page.getByLabel(/correo electrónico|email/i).fill(email!)
    await page.getByLabel(/contraseña|password/i).fill(password!)
    await page
      .getByRole('button', { name: /iniciar sesión|sign in|login/i })
      .click()

    // REQUERIMIENTO DEL PROMPT: Valida que tras el éxito con Supabase, el middleware de Next.js nos redirija de inmediato a la ruta privada
    await expect(page).toHaveURL(/dashboard/)
  })

  // PRUEBA 4: Valida la seguridad y restricciones de acceso (Route Guards / Middleware)
  test('protege /dashboard si no hay sesión', async ({ page }) => {
    // Intentamos forzar la URL e ingresar directamente a una ruta que requiere autenticación obligatoria
    await page.goto('/dashboard')
    
    // CONTROL DE SEGURIDAD: El sistema debe interceptar al usuario anónimo y rebotarlo (redireccionarlo) automáticamente de vuelta al login
    await expect(page).toHaveURL(/login/)
  })
})