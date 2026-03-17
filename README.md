# Swim UI (React + TypeScript + Tailwind v4)

Frontend de la iteracion 1 para consumir la API de `sportsclub`.

Alcance implementado:

1. Landing page.
2. Login UI-only (sin autenticacion backend en esta iteracion).
3. Gestion de atletas (listar, crear, editar, selector de direccion).
4. Programacion de entrenamientos (listar y crear con relaciones).

Fuera de alcance en iteracion 1:

1. Dashboard de competiciones.
2. Edicion de resultados/puntuaciones.

## Requisitos previos

1. `git`.
2. `python` y `pip`.
3. `docker` y `docker compose`.
4. `node` y `npm`.

## Arranque desde cero

### 1) Clonar y posicionarse en el proyecto

```bash
git clone <url-del-repo>
cd swim-manager
```

### 2) Instalar dependencias Python

```bash
pip install -r requirements.txt
```

### 3) Levantar backend con Docker

```bash
docker compose up -d
```

API esperada tras levantar contenedores:

`http://localhost:8000/api/v1`

### 4) Preparar base de datos y datos de prueba

En una terminal aparte:

```bash
cd sportsclub
python manage.py migrate
python manage.py loaddata \
  core/fixtures/addresses.json \
  inventory/fixtures/venues.json \
  people/fixtures/coaches.json \
  people/fixtures/athletes.json \
  scheduling/fixtures/seasons.json \
  scheduling/fixtures/competitions.json \
  scheduling/fixtures/trainings.json
cd ..
```

Alternativa equivalente:

```bash
make load-fixtures
```

### 5) Instalar dependencias del frontend

```bash
npm --prefix /home/tian/Documentos/FP/diseño/swim-manager/frontend/swim-ui install
```

Nota: se usa `npm --prefix` para evitar problemas de directorio actual cuando hay varias terminales abiertas.

### 6) Configurar URL de la API para Vite

Crear archivo `frontend/swim-ui/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 7) Ejecutar frontend en desarrollo

```bash
npm --prefix /home/tian/Documentos/FP/diseño/swim-manager/frontend/swim-ui run dev
```

Abrir la URL que muestre Vite (habitualmente `http://localhost:5173`).

## Verificaciones recomendadas

### Build de produccion

```bash
npm --prefix /home/tian/Documentos/FP/diseño/swim-manager/frontend/swim-ui run build
```

### Lint

```bash
npm --prefix /home/tian/Documentos/FP/diseño/swim-manager/frontend/swim-ui run lint
```

## Contexto para correccion

1. La app frontend consume endpoints reales de Django Ninja y refleja errores `404`, `409` y `422` en interfaz.
2. Login es deliberadamente UI-only en esta iteracion.
3. La evidencia de analisis y planificacion se mantiene en `frontend/swim-ui/docs`.
4. El trabajo de competiciones se deja documentado para iteracion 2.
