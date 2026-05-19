import { describe, expect, it } from 'vitest'
// 'renderHook' es una herramienta crucial de Testing Library. 
// Como los hooks de React no se pueden ejecutar como funciones normales de JS (necesitan el ciclo de vida de React),
// renderHook simula un componente invisible para poder ejecutar el hook de forma segura en el test.
import { renderHook } from '@testing-library/react'
import { useTasksByStatus } from '@/hooks/use-tasks-by-status'
import type { Task } from '@/types/tasks'

describe('useTasksByStatus', () => {
  // CASO DE PRUEBA 1: El camino feliz (agrupar correctamente)
  it('agrupa tareas por estado', () => {
    // Creamos un escenario (mock data) con 3 tareas ficticias, cada una con un estado diferente
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        description: 'Desc 1',
        status: 'todo',
        priority: 'high',
        position: 1,
        created_at: '2026-04-15T00:00:00.000Z',
        updated_at: '2026-04-15T00:00:00.000Z',
        due_date: '2026-04-20',
        user_id: 'u1',
      },
      {
        id: '2',
        title: 'Task 2',
        description: 'Desc 2',
        status: 'in_progress',
        priority: 'medium',
        position: 2,
        created_at: '2026-04-15T00:00:00.000Z',
        updated_at: '2026-04-15T00:00:00.000Z',
        due_date: '2026-04-21',
        user_id: 'u1',
      },
      {
        id: '3',
        title: 'Task 3',
        description: 'Desc 3',
        status: 'done',
        priority: 'low',
        position: 3,
        created_at: '2026-04-15T00:00:00.000Z',
        updated_at: '2026-04-15T00:00:00.000Z',
        due_date: '2026-04-22',
        user_id: 'u1',
      },
    ]

    // Ejecutamos el hook pasándole la lista de tareas ficticias
    const { result } = renderHook(() => useTasksByStatus(tasks))

    // ASERCIONES: Verificamos que el hook haya hecho bien su trabajo divisor.
    // Esperamos que cada categoría ('todo', 'in_progress', 'done') contenga exactamente 1 tarea.
    expect(result.current.todo).toHaveLength(1)
    expect(result.current.in_progress).toHaveLength(1)
    expect(result.current.done).toHaveLength(1)
  })

  // CASO DE PRUEBA 2: Control de errores o estados vacíos (Edge Case)
  it('devuelve arreglos vacíos si no hay tareas', () => {
    // Ejecutamos el hook pasándole un arreglo completamente vacío
    const { result } = renderHook(() => useTasksByStatus([]))

    // ASERCIONES: El sistema no debe romperse ni dar 'undefined'. 
    // Debe retornar listas vacías listas para ser mapeadas en la UI sin crasheos.
    expect(result.current.todo).toEqual([])
    expect(result.current.in_progress).toEqual([])
    expect(result.current.done).toEqual([])
  })
})