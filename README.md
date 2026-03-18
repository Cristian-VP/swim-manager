# Swim UI (React + TypeScript + Tailwind v4)

Frontend de la iteracion 1 para consumir la API de `sportsclub`.

Alcance implementado:

1. Home page.
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

### 1) Clonar

```bash
git clone <url-del-repo>
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

### 4) Ejecutar migraciones y queries para los datos de prueba

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


### 5) Instalar dependencias del frontend

```bash
cd frontend/swim-ui
npm install
```


### 6) Configurar URL de la API para Vite

Crear archivo `.env` siguiendo el ejemplo de env.example


### 7) Ejecutar frontend en desarrollo

```bash
cd frontend/swim-ui
npm run dev
```

Abrir la URL que muestre Vite (habitualmente `http://localhost:5173`).


## Contexto para correccion

1. La app frontend consume endpoints reales de Django creados en sprotclub/ y refleja errores `404`, `409` y `422` en interfaz.
2. Login no implementado, unicamente UI-only en esta iteracion.
3.User case que se han cubierto son: acceso a back office desde landing (pseudo login), acesso a Athletes, acceso a Trainings. 
4. Se ha tomado como base los wireframes ejecutados en los ejercicios anteriores. 
5. El resto de acciones están deshabilitada.


