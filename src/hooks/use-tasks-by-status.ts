import { useMemo } from 'react'
// Importamos los tipos de TypeScript para asegurar que las tareas tengan la estructura correcta de la base de datos
import type { Task, TaskStatus } from '@/types/tasks'

// Definimos un tipo que representa un objeto cuyas llaves son los estados ('todo', 'in_progress', 'done') 
// y cuyos valores son arreglos de tareas. Ejemplo: { todo: [...], done: [...] }
type TasksByStatus = Record<TaskStatus, Task[]>

// Esta función recibe un arreglo plano con TODAS las tareas del usuario
export function useTasksByStatus(tasks: Task[]): TasksByStatus {
  /*
    Usamos 'useMemo' para optimizar el rendimiento. 
    Le dice a React: "Solo vuelve a ejecutar estos filtros si el arreglo original de 'tasks' cambia".
    Si el componente se renderiza por otras razones (como mover un mouse), reutiliza el resultado anterior en memoria.
  */
  return useMemo(
    () => ({
      // Filtra y agrupa las tareas que están en cola por hacer
      todo: tasks.filter((task) => task.status === 'todo'),
      // Filtra y agrupa las tareas que se están ejecutando actualmente
      in_progress: tasks.filter((task) => task.status === 'in_progress'),
      // Filtra y agrupa las tareas ya finalizadas
      done: tasks.filter((task) => task.status === 'done'),
    }),
    [tasks] // Dependencia de useMemo: vigila este arreglo
  )
}