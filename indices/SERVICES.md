# Registro de Servicios

> **Regla de Actualización:** El Agente debe sugerir adiciones a esta tabla cada vez que asiente lógica de negocio, consuma un endpoint externo, o implemente un *State Manager*.

| Servicio / Patrón | Responsabilidad Principal | Ubicación (File Path) | Dependencias | Estado |
|-------------------|--------------------------|-----------------------|--------------|--------|
| `AuthFacadeService` | Coordina UI con API de Auth de Supabase | `core/services/auth/auth-facade.service.ts` | SupabaseClient | ✅ Estable |
