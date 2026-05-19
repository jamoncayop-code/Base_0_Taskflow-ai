// taskflow-ai/src/actions/__tests__/tasks.test.ts

// Importamos las herramientas de Vitest
import { beforeEach, describe, expect, it, vi } from 'vitest'
// Importamos las Server Actions reales que vas a testear (traer tareas y actualizar su estado)
import { getTasks, updateTaskStatus } from '@/actions/tasks'
// Importamos el creador de clientes de Supabase y el revalidador de caché de Next.js
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/*
  SIMULACIÓN GLOBAL (vi.mock):
  Le decimos a Vitest: "Cuando el código intente usar el cliente de Supabase o la caché de Next.js,
  no uses los archivos reales. Reemplázalos por funciones espía falsas (vi.fn())".
*/
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('tasks actions', () => {
  // Antes de ejecutar cada test individual, limpiamos el historial de los espías
  // Esto evita que el conteo de llamadas de un test interfiera con el siguiente
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // PRUEBA 1: Validar seguridad (Control de usuarios anónimos)
  it('getTasks devuelve [] si no hay usuario autenticado', async () => {
    /*
      Configuramos el simulador de Supabase para este test específico:
      Simulamos que al llamar a 'auth.getUser()', Supabase responde que el usuario es 'null' (no está logueado).
    */
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    } as any)

    // Ejecutamos la acción real
    const result = await getTasks()
    
    // ASERCIÓN: Si no hay usuario, la función debe protegernos devolviendo un arreglo vacío, no un error ni datos ajenos.
    expect(result).toEqual([])
  })

  // PRUEBA 2: Validar el flujo de actualización y refresco de pantalla
  it('updateTaskStatus actualiza estado y revalida dashboard', async () => {
    /*
      Supabase usa encadenamiento de funciones como: supabase.from('tasks').update({...}).eq('id', '1')
      Aquí construimos esa estructura en forma de "escalera de espías" falsos:
    */
    const mockEq = vi.fn().mockResolvedValue({ error: null }) // .eq() finaliza con éxito sin errores
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq }) // .update() nos devuelve la función .eq()
    const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate }) // .from() nos devuelve la función .update()

    // Le inyectamos esta escalera simulada al cliente de Supabase
    vi.mocked(createClient).mockResolvedValue({
      from: mockFrom,
    } as any)

    // Ejecutamos la acción real simulando que movimos la tarea 'task-1' a la columna 'done' (Completado)
    await updateTaskStatus('task-1', 'done')

    // ASERCIONES (Verificación de los espías):
    // 1. Verificamos que la acción buscó apuntar a la tabla correcta de Supabase: 'tasks'
    expect(mockFrom).toHaveBeenCalledWith('tasks')
    
    // 2. Verificamos que la condición de actualización se aplicó específicamente a la tarea correcta
    expect(mockEq).toHaveBeenCalledWith('id', 'task-1')
    
    /*
      3. MUY IMPORTANTE EN NEXT.JS:
      Verificamos que la acción llamó a 'revalidatePath('/dashboard')'.
      Esto le dice a Next.js que borre la caché vieja del Dashboard y obligue a la pantalla 
      a redibujarse para que el usuario vea en tiempo real que su tarea se movió de columna.
    */
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard')
  })
})