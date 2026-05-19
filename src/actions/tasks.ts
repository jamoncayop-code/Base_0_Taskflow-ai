// taskflow-ai/src/actions/tasks.ts

// Le indicamos a Next.js que todas las funciones de este archivo son "Server Actions"
// Esto significa que se ejecutarán única y exclusivamente en el servidor de forma segura
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Task, TaskStatus } from '@/types/tasks'

/**
 * ACCIÓN 1: Trae todas las tareas de la base de datos que le pertenecen al usuario logueado.
 */
export async function getTasks(): Promise<Task[]> {
  // Inicializamos el cliente de Supabase del lado del servidor
  const supabase = await createClient()

  // Obtenemos el usuario que está haciendo la petición
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // CONTROL DE SEGURIDAD: Si no hay un usuario autenticado, bloqueamos la consulta
  // y devolvemos un arreglo vacío inmediatamente (tal como lo espera el test unitario)
  if (!user) {
    return []
  }

  // Hacemos la consulta a Supabase: 
  // Selecciona todo de la tabla 'tasks' donde el 'user_id' coincida con el usuario actual,
  // y ordénalas por su posición en el tablero de forma ascendente.
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('position', { ascending: true })

  // Si hubo un error en la base de datos o no hay datos, devolvemos un arreglo vacío para proteger la UI
  if (error || !data) {
    console.error('Error al obtener tareas:', error)
    return []
  }

  // Devolvemos las tareas casteadas con nuestro tipo 'Task' para que TypeScript esté feliz
  return data as Task[]
}

/**
 * ACCIÓN 2: Actualiza el estado (columna) de una tarea específica cuando la mueves.
 * @param id El identificador único de la tarea (UUID)
 * @param status El nuevo estado al que se mueve ('todo', 'in_progress', 'done')
 */
export async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  const supabase = await createClient()

  // Vamos a la tabla 'tasks', le decimos que modifique el campo 'status' con el nuevo valor,
  // pero filtrando estrictamente por la fila que tenga el 'id' de nuestra tarea.
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error al actualizar el estado de la tarea:', error)
    throw new Error('No se pudo actualizar la tarea')
  }

  /* 
    REVALIDACIÓN DE CACHÉ: 
    Como Next.js guarda en caché las páginas por rendimiento, si modificamos la base de datos,
    la pantalla del usuario no se enteraría del cambio.
    'revalidatePath' le dice a Next.js: "Limpia la caché de /dashboard y vuelve a renderizarla",
    logrando que la tarjeta aparezca mágicamente en su nueva columna al instante.
  */
  revalidatePath('/dashboard')
}