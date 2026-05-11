// Importamos la función para redireccionar al usuario
import { redirect } from 'next/navigation'
// Importamos el cliente de Supabase configurado para el servidor
import { createClient } from '@/lib/supabase/server'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { error?: string }
}) {

    // Esta es la "Server Action" que procesa el formulario
    async function login(formData: FormData) {
        'use server' // Indica que esta función solo se ejecuta en el servidor

        // Extraemos los datos del formulario de forma segura
        const email = String(formData.get('email') ?? '')
        const password = String(formData.get('password') ?? '')

        // Inicializamos el cliente de Supabase
        const supabase = await createClient()

        // Intentamos iniciar sesión con correo y contraseña
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        // Si hay un error (ej. contraseña incorrecta), redireccionamos con un mensaje
        if (error) {
            redirect('/login?error=Credenciales%20invalidas')
        }
        
        // Si todo sale bien, lo enviamos al dashboard
        redirect('/dashboard')
    }

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900">
                        TaskFlow AI
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Inicia sesión para entrar al tablero
                    </p>
                </div>

                {searchParams.error && (
                    <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {searchParams.error}
                    </div>
                )}

                <form action={login} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Correo
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="demo@taskflow.ai"
                            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 outline-none focus:border-slate-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Contraseña
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="********"
                            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 outline-none focus:border-slate-900"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
                    >
                        Entrar
                    </button>
                </form>
            </section>
        </main>
    )
}