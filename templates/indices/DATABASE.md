# Registro de Base de Datos (Supabase)

> **Regla de Actualización (OBLIGATORIA):** El Agente DEBE usar sus herramientas de escritura de archivos para definir nuevas tablas en la lista de abajo cada vez que genere migraciones en `supabase/migrations/`. La documentación del RLS y FDs debe ser estricta.

| Tabla / Colección | Core / Dominio | Columnas Clave | Relaciones (FKs) | Restricciones RLS (Policies) | Estado |
|-------------------|----------------|----------------|------------------|------------------------------|--------|
| `profiles` | Auth | `id`, `household_id` | N/A (id vinculada a `auth.users`) | `SELECT` public, `UPDATE` own id | ✅ Estable |
