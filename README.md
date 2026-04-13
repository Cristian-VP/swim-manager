# Swim Manager Front-Office

## Introducción
Swim Manager, es una herramienta administrativa enfocada dentro del caso práctico *Athletics Sports Club API*. En esta entrega correspondiente a la **Iteración 2**, se encuentra desarrollada en React (Vite) aplicando un enfoque exclusivo a las vistas de solo lectura (**GET requests only**).

## Requisitos Previos 
Asegúrate de tener instaladas las siguientes herramientas en tu sistema operativo:
- [Node.js](https://nodejs.org/) (Versión 18+ recomendada)
- `npm` (gestor de dependencias integrado con Node.js)
- [Docker](https://www.docker.com/) y `docker-compose` (necesarios para aprovisionar el servidor backend de la API provista).

---

## Pasos para la carga y ejecución local

Para probar este código partiendo de cero, el desarrollador (o evaluador) debe realizar los siguientes pasos:

Para que la interfaz de la aplicación pueda cargar datos reales (y no marcadores como "Falta por implementar"), debes mantener encendida la API oficial adjunta al caso del Club.

*(Nota: El frontend está configurado asumiendo que la API queda escuchando en el puerto base `http://localhost:8000/api/v1`)*.

### 1. Iniciar el entorno Frontend
```bash
# 1. Accede a la raíz de este proyecto Frontend
cd /ruta/hacia/swim-manager

# 2. Instala todas las librerías y dependencias necesarias listadas en package.json
npm install

# 3. Arranca el servidor local de Vite
npm run dev
```
La aplicación web quedará accesible en tu navegador abriendo [http://localhost:5173](http://localhost:5173).

---

## Notas extras y contexto para la Evaluación (Teacher's Note)


### Rigor en los *Technical Requirements*
En esta práctica me he ceñido rigurosamente al objetivo: _"API Integration (GET requests only) [...] Focus strictly on implementing the read-only parts of your user stories"_.

A lo largo de los componentes como la vista central (`HomeManagerPage`), la lista de atletas (`AthletesPage`) o la agenda de entrenamientos (`TrainingsPage`), observarás hooks reactivos integrados con llamadas al método `fetch()` apuntando estrictamente a la API que se pidió levantar vía Docker Compose. 

No se introdujeron operaciones `POST`, `PUT` o `DELETE` que interfieran o adelanten indebidamente el contenido funcional planificado para la **fase 3** y se corrigieron errores cometidos en la iteración 1. El enfoque general asume proveer una base altamente descriptiva con flujos bien controlados (incluyendo sus rutas si la API arroja excepciones o `HTTP 500`).

### Refactorización y Arquitectura

Notarás que dejé a propósito un diagrama detallando la ruta arquitectónica en la raíz, llamado **`chm.svg` (Component Hierarchy Map)**. Éste documenta cómo refactorizamos los componentes gigantes iniciales a favor de un enfoque mucho más atómico mediante el concepto de layouts y contenedores (`Outlet`). Adicionalmente, el documento visual **`user-story-view-training.svg`** en la misma carpeta describe una métrica visual completa documentando el ciclo interactivo y técnico del proyecto hasta ahora.

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
