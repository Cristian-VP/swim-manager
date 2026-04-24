# Swim Manager Front-Office

## Introducción
Swim Manager, es una herramienta administrativa enfocada dentro del caso práctico *Athletics Sports Club API*. En esta entrega correspondiente a la **Iteración 3**, se encuentra desarrollada en React (Vite).


## Pasos para la carga y ejecución

Esta entrega se distribuye contenerizada. No es necesario instalar Node.js localmente ni ejecutar ningún servidor de desarrollo.

Para que la interfaz de la aplicación pueda cargar datos reales, debes mantener encendida la API oficial adjunta al caso del Club.

*(Nota: El frontend está configurado asumiendo que la API queda escuchando en el puerto base `http://localhost:8000/api/v1`)*.

### 1. Construir y arrancar el contenedor
```bash
# Desde la raíz de este proyecto
docker compose -f docker/docker-compose.yml up --build
```
La aplicación web quedará accesible en tu navegador abriendo [http://localhost:8080](http://localhost:8080).

### 2. Parar el contenedor
```bash
docker compose -f docker/docker-compose.yml down
```

> **Nota técnica:** El build es multi-stage. La primera etapa (`node:22-alpine`) instala dependencias con `npm ci` y genera el bundle de producción con `npm run build`. La segunda etapa (`nginx:alpine`) sirve únicamente el contenido estático de `dist/`, sin incluir Node.js ni herramientas de desarrollo en la imagen final.

---

## Operaciones CRUD implementadas

Esta iteración extiende la entrega anterior incorporando las operaciones de escritura (`POST`, `PATCH`, `DELETE`) sobre los tres dominios del club. A continuación se describe qué hace cada módulo y qué verbos HTTP utiliza.

### Atletas (`/people/athletes`)

| Operación | Verbo HTTP | Descripción |
|---|---|---|
| Listar atletas | `GET` | Carga el catálogo completo al montar la página. |
| Ver detalle | `GET` | Obtiene todos los datos de un atleta al seleccionarlo en la lista. |
| Crear atleta | `POST` | Formulario overlay con validación; registra un nuevo atleta. |
| Editar atleta | `PATCH` | El mismo formulario en modo edición; actualiza nombre, especialidad, etc. |
| Eliminar atleta | `DELETE` | Toast con cuenta atrás; la lista se actualiza en local tras confirmar. |

### Entrenamientos (`/scheduling/trainings`)

| Operación | Verbo HTTP | Descripción |
|---|---|---|
| Listar sesiones | `GET` | Carga la agenda completa al montar la página. |
| Ver detalle | `GET` | Obtiene sede, foco y atletas convocados de la sesión seleccionada. |
| Crear sesión | `POST` | Formulario overlay; permite asignar fecha, sede, foco y atletas. |
| Editar sesión | `PATCH` | El mismo formulario en modo edición; actualiza los campos modificados. |

### Competiciones (`/scheduling/competitions`) — desde el Dashboard

| Operación | Verbo HTTP | Descripción |
|---|---|---|
| Listar competiciones | `GET` | El calendario del dashboard carga las competiciones al arrancar. |
| Ver detalle | `GET` | Obtiene la ficha completa al seleccionar una competición del calendario. |
| Crear competición | `POST` | Formulario overlay accesible desde el calendario. |
| Eliminar competición | `DELETE` | Toast con cuenta atrás; elimina la competición y actualiza el calendario. |

### Mecanismo de feedback al usuario

Todas las operaciones de escritura siguen el mismo patrón de respuesta en la UI:
- **Éxito** → `<SuccessToast />`: notificación flotante que desaparece automáticamente.
- **Error de API** → `<ErrorMessage />` inline o `<ErrorModal />` para errores críticos.
- **Confirmación de borrado** → `<DeleteCountdownToast />`: cuenta atrás de 5 segundos con opción de cancelar antes de ejecutar el `DELETE`.

### Estructura de Directorios y Organización del Dominio
El proyecto ha sido estructurado siguiendo una arquitectura **Feature-based** para favorecer el mantenimiento y evitar el acoplamiento globalizado:

```text
src/
├── components/          # Componentes genéricos y transversales.
│   └── ui/              # Bloques de interfaz compartidos (ej. `<ErrorMessage />`).
├── features/            # Directorio núcleo: Cada subcarpeta encapsula su propia página y subcomponentes locales.
│   ├── athletes/        # Dominio de Atletas (AthletesPage, AthleteList, AthleteDetail).
│   ├── trainings/       # Dominio de Entrenamientos (TrainingsPage, TrainingList, TrainingDetail).
│   ├── home-manager/    # Dashboard administrativo principal (Métricas cross-domain).
│   ├── back-office/     # Shell del panel interno (Layout, NavBar lateral).
│   └── public-landing/  # [Auth] Área pública pre-login.
│       ├── login/           
│       └── recover-password/
├── lib/                 # Lógica de abstracción agnóstica de la vista (Utils).
│   └── api.ts           # Handler HTTP centralizado (Ejecuta fetch y gestiona excepciones).
├── App.tsx              # Componente Wrapper de mayor nivel.
└── main.tsx             # Punto de montaje estricto (React DOM Root).
```

**Flujo de las llamadas HTTP (Fetching local):**
Las peticiones al backend están resueltas mediante una estrategia estándar descentralizada coordinada a través de un handler común:
1. Las llamadas a la red se originan dentro de funciones asíncronas en los bloques `useEffect` a nivel de componente "Page" (los componentes de enrutamiento principal de cada Feature).
2. Internamente consumen el módulo `lib/api.ts` invocando el genérico universal `apiRequest<T>('/ruta')`.
3. Una vez se resuelve la promesa o falla (arrojando un error instanciado de la clase custom `ApiError`), los manejadores capturan la excepción e informan a la capa UI (empleando tipados estandarizados). Todo sin librerías de terceros (vanilla `fetch()`).
