// taskflow-ai/src/types/tasks.ts

/* 
  Definimos los tres estados únicos y estrictos que puede tener una tarea en nuestro Kanban.
  Esto evita que por error escribamos "en-progreso" o "finalizado" en lugar de los strings correctos.
*/
export type TaskStatus = 'todo' | 'in_progress' | 'done'

/* 
  Definimos los niveles de prioridad permitidos para las tarjetas del tablero.
*/
export type TaskPriority = 'low' | 'medium' | 'high'

/* 
  Este es el molde principal (Interface) que describe exactamente cómo luce una tarea 
  tanto en la base de datos de Supabase como en el estado de React de nuestra aplicación.
*/
export interface Task {
  id: string              // Identificador único (UUID generado por la base de datos)
  title: string           // Título de la tarea (ej: "Configurar Playwright")
  description: string     // Descripción detallada del objetivo
  status: TaskStatus      // Estado actual restringido a los tres tipos de arriba
  priority: TaskPriority  // Prioridad de la tarea para ordenamiento visual
  position: number        // Posición numérica (crucial para cuando programes el Drag and Drop)
  user_id: string         // El ID del usuario de Supabase al que le pertenece esta tarea
  created_at: string      // Fecha de creación en formato ISO string
  updated_at: string      // Fecha de última modificación en formato ISO string
  due_date?: string       // Fecha límite de entrega (el '?' significa que es opcional)
}