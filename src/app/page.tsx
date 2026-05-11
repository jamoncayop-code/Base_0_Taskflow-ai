// Importamos la función necesaria para redirigir al usuario
import { redirect } from 'next/navigation'

// Definimos el componente de la página de inicio (Home)
export default function HomePage() {
  
  // Ejecutamos la redirección automática hacia la ruta '/login'
  // Esto asegura que la raíz de tu sitio (/) no esté vacía
  redirect('/login')
  
}