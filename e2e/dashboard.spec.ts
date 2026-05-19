// taskflow-ai/e2e/dashboard.spec.ts

// Importamos las herramientas de aserción y ejecución de Playwright
import { test, expect } from '@playwright/test'

// Agrupamos las pruebas orientadas al Tablero Principal (Dashboard)
test.describe('dashboard', () => {

  /*
    TEST COHERENTE 1: Valida el estado actual de tu Dashboard real.
    Como este archivo NO tiene un 'test.use' de limpiar sesión, Playwright 
    usará automáticamente el login inyectado por 'auth.setup.ts'.
  */
  test('muestra la bienvenida y los datos del usuario autenticado', async ({ page }) => {
    // Viaja a la ruta protegida del dashboard
    await page.goto('/dashboard')

    // REQUERIMIENTO DEL PROMPT: Valida que el título principal de bienvenida sea visible
    await expect(
      page.getByRole('heading', { name: /bienvenido a taskflow ai/i })
    ).toBeVisible()

    // Valida que el texto descriptivo del proyecto esté presente en el HTML
    await expect(
      page.getByText(/este será el tablero tipo trello/i)
    ).toBeVisible()

    // Valida que la tarjeta informativa esté mostrando un correo con formato de texto (el del usuario autenticado)
    await expect(page.getByText(/correo:/i)).toBeVisible()
  })

  /*
    TEST COHERENTE 2 (Futuro): Estructura base para las columnas Kanban.
    USAMOS 'test.skip' porque tu pantalla actual aún no dibuja las columnas.
    Esto le dice a Playwright: "Sé que este test existe, pero sáltatelo por ahora".
  */
  test.skip('muestra columnas del kanban', async ({ page }) => {
    await page.goto('/dashboard')

    // Cuando programes el Kanban, este test buscará los títulos de las tres columnas obligatorias
    await expect(
      page.getByRole('heading', { name: /por hacer|to do|todo/i })
    ).toBeVisible()

    await expect(
      page.getByRole('heading', { name: /en progreso|in progress/i })
    ).toBeVisible()

    await expect(
      page.getByRole('heading', { name: /completado|done/i })
    ).toBeVisible()
  })

  /*
    TEST COHERENTE 3 (Futuro): Estructura base para interactuar con formularios.
    Mantenemos el 'test.skip' original del prompt porque describe una acción que desarrollarás más adelante.
  */
  test.skip('permite crear nueva tarea', async ({ page }) => {
    await page.goto('/dashboard')

    // Simulará la apertura del modal y el llenado del formulario usando selectores accesibles por etiqueta
    await page.getByRole('button', { name: /new task|nueva tarea/i }).click()
    await page.getByLabel(/title|título/i).fill('Nueva tarea e2e')
    await page.getByLabel(/description|descripción/i).fill('Creada desde Playwright')
    
    // Enviará los datos haciendo clic en el botón de confirmación
    await page.getByRole('button', { name: /create|crear/i }).click()

    // Confirmará si la nueva tarjeta se renderizó exitosamente en la interfaz
    await expect(page.getByText(/nueva tarea e2e/i)).toBeVisible()
  })
})