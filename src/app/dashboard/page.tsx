// Importamos herramientas de navegación y el cliente de servidor de Supabase
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Definimos la función como 'async' porque consultaremos a la base de datos
export default async function DashboardPage() {
  
  // Inicializamos el cliente de Supabase (lado del servidor)
  const supabase = await createClient()

  // Obtenemos la información del usuario actual
  // getUser() es la forma más segura de verificar la sesión en el servidor
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // PROTECCIÓN DE RUTA: 
  // Si no hay un usuario autenticado, lo mandamos de patitas a la calle (al login)
  if (!user) {
    redirect('/login')
  }

  // Si el código llega aquí, significa que el usuario sí está logueado
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <section className="mx-auto max-w-5xl">
        
        {/* Encabezado informativo */}
        <p className="mb-2 text-sm text-slate-400">
          Usuario autenticado:
        </p>

        <h1 className="text-3xl font-bold">
          Bienvenido a TaskFlow AI
        </h1>

        <p className="mt-4 text-slate-300">
          Este será el tablero tipo Trello donde construiremos columnas,
          tareas, drag and drop, Supabase y despliegue en producción.
        </p>

        {/* Tarjeta con los datos del usuario */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Correo:</p>
          {/* Mostramos el email del usuario extraído de la sesión */}
          <p className="font-mono text-green-400">{user.email}</p>
        </div>
        
      </section>
    </main>
  )
}