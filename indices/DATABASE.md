# Registro de Base de Datos (Supabase)

> **Regla de Actualización:** El Agente debe sugerir adiciones a esta tabla cada vez que modifique `supabase/migrations/` o interactúe con el Dashboard de tablas.

| Tabla / Colección | Core / Dominio | Columnas Clave | Detalles RLS (Policies) | Estado |
|-------------------|----------------|----------------|-------------------------|--------|
| `profiles` | Auth | `id`, `household_id` | `SELECT` public, `UPDATE` own id | ✅ Estable |
