# Sportsclub API Agent Guide

## Objetivo
Consumir la API del backend Sportsclub para construir UI (lectura y CRUD básico) en entorno local.

## Base URL
`http://localhost:8000`

## Documentación viva
- `GET /api/v1/openapi.json`

## Convenciones generales
1. Todos los recursos usan `public_id` como identificador en rutas de detalle.
2. Patrón por recurso:
   - Colección: `GET` + `POST`
   - Detalle: `GET` + `PUT` + `PATCH` + `DELETE`
3. Códigos esperados:
   - `GET` lista/detalle: `200`
   - `POST`: `201`
   - `DELETE`: `204`
   - Errores habituales: `400`, `404`, `422`

## Endpoints existentes y función

### Core
- `GET /api/v1/core/addresses`: lista direcciones
- `POST /api/v1/core/addresses`: crea dirección
- `GET /api/v1/core/addresses/{public_id}`: detalle dirección
- `PUT /api/v1/core/addresses/{public_id}`: actualización completa
- `PATCH /api/v1/core/addresses/{public_id}`: actualización parcial
- `DELETE /api/v1/core/addresses/{public_id}`: borrado

### Inventory
- `GET /api/v1/inventory/venues`: lista sedes
- `POST /api/v1/inventory/venues`: crea sede
- `GET /api/v1/inventory/venues/{public_id}`: detalle sede
- `PUT /api/v1/inventory/venues/{public_id}`: actualización completa
- `PATCH /api/v1/inventory/venues/{public_id}`: actualización parcial
- `DELETE /api/v1/inventory/venues/{public_id}`: borrado

### People
- `GET /api/v1/people/athletes`: lista atletas
- `POST /api/v1/people/athletes`: crea atleta
- `GET /api/v1/people/athletes/{public_id}`: detalle atleta
- `PUT /api/v1/people/athletes/{public_id}`: actualización completa
- `PATCH /api/v1/people/athletes/{public_id}`: actualización parcial
- `DELETE /api/v1/people/athletes/{public_id}`: borrado

- `GET /api/v1/people/coaches`: lista coaches
- `POST /api/v1/people/coaches`: crea coach
- `GET /api/v1/people/coaches/{public_id}`: detalle coach
- `PUT /api/v1/people/coaches/{public_id}`: actualización completa
- `PATCH /api/v1/people/coaches/{public_id}`: actualización parcial
- `DELETE /api/v1/people/coaches/{public_id}`: borrado

### Scheduling
- `GET /api/v1/scheduling/competitions`: lista competiciones
- `POST /api/v1/scheduling/competitions`: crea competición
- `GET /api/v1/scheduling/competitions/{public_id}`: detalle competición
- `PUT /api/v1/scheduling/competitions/{public_id}`: actualización completa
- `PATCH /api/v1/scheduling/competitions/{public_id}`: actualización parcial
- `DELETE /api/v1/scheduling/competitions/{public_id}`: borrado

- `GET /api/v1/scheduling/seasons`: lista temporadas
- `POST /api/v1/scheduling/seasons`: crea temporada
- `GET /api/v1/scheduling/seasons/{public_id}`: detalle temporada
- `PUT /api/v1/scheduling/seasons/{public_id}`: actualización completa
- `PATCH /api/v1/scheduling/seasons/{public_id}`: actualización parcial
- `DELETE /api/v1/scheduling/seasons/{public_id}`: borrado

- `GET /api/v1/scheduling/trainings`: lista entrenamientos
- `POST /api/v1/scheduling/trainings`: crea entrenamiento
- `GET /api/v1/scheduling/trainings/{public_id}`: detalle entrenamiento
- `PUT /api/v1/scheduling/trainings/{public_id}`: actualización completa
- `PATCH /api/v1/scheduling/trainings/{public_id}`: actualización parcial
- `DELETE /api/v1/scheduling/trainings/{public_id}`: borrado

## Forma JSON observada (listas)
- `addresses`: `public_id`, `formatted_address`
- `venues`: `public_id`, `name`, `venue_type`, `indoor`
- `athletes`: `public_id`, `first_name`, `last_name`, `jersey_number`
- `coaches`: `public_id`, `first_name`, `last_name`, `certification`
- `competitions`: `public_id`, `name`, `date`, `season`
- `seasons`: `public_id`, `name`, `start_date`, `end_date`
- `trainings`: `public_id`, `name`, `date`, `season`, `focus`

## Errores que el agente debe manejar
1. `400 Bad Request`
   - Causa: payload inválido en creación/actualización.
   - Acción: mostrar validaciones y no reintentar automáticamente.

2. `404 Not Found`
   - Causa: ruta incorrecta o `public_id` inexistente.
   - Acción: verificar endpoint y existencia del recurso.

3. `422 Unprocessable Entity`
   - Causa: validación semántica/esquema.
   - Acción: mapear errores de campo en UI.

4. `204 No Content` en `DELETE`
   - Causa: borrado exitoso sin body.
   - Acción: no parsear JSON en esta respuesta.

5. `5xx` o timeout
   - Causa: backend caído/no saludable/proxy.
   - Acción: reintento con backoff corto (2 a 3 intentos) y fallback visual.

6. Error de red o CORS
   - Causa: problema de transporte o cabeceras.
   - Acción: distinguir error HTTP de error de red y reportarlos por separado.

## Comandos para inspeccionar JSON real

### 1) Listar paths desde OpenAPI
```bash
curl -sS http://localhost:8000/api/v1/openapi.json | jq -r '.paths | keys[]'
```

### 2) Ver status + muestra de cada lista
```bash
for ep in /api/v1/core/addresses /api/v1/inventory/venues /api/v1/people/athletes /api/v1/people/coaches /api/v1/scheduling/competitions /api/v1/scheduling/seasons /api/v1/scheduling/trainings; do
  echo "=== $ep ==="
  code=$(curl -sS -o /tmp/out.json -w "%{http_code}" "http://localhost:8000$ep")
  echo "HTTP $code"
  cat /tmp/out.json | jq '.[0] // .'
done
```

### 3) Tomar `public_id` del primer elemento y consultar detalle
```bash
for ep in /api/v1/core/addresses /api/v1/inventory/venues /api/v1/people/athletes /api/v1/people/coaches /api/v1/scheduling/competitions /api/v1/scheduling/seasons /api/v1/scheduling/trainings; do
  id=$(curl -sS "http://localhost:8000$ep" | jq -r '.[0].public_id // empty')
  if [ -n "$id" ]; then
    echo "=== $ep/$id ==="
    curl -sS "http://localhost:8000$ep/$id" | jq .
  fi
done
```

### 4) Ver códigos de respuesta por operación desde OpenAPI
```bash
curl -sS http://localhost:8000/api/v1/openapi.json | jq -r '
  .paths as $p
  | keys[] as $k
  | $p[$k] as $ops
  | ($ops | keys[]) as $m
  | "\($m|ascii_upcase) \($k) -> \($ops[$m].responses|keys|join(","))"
'
```
