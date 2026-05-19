// taskflow-ai/vitest.setup.ts

// Importamos la integración oficial de jest-dom diseñada específicamente para Vitest.
// Al importar esto aquí (y tener este archivo referenciado en 'setupFiles' de tu vitest.config.ts),
// se extienden automáticamente las capacidades del objeto 'expect' en todas tus pruebas.
import '@testing-library/jest-dom/vitest'