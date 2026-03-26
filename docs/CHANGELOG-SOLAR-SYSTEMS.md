# Changelog - Solar Systems API

Date: 2026-03-25

## Current Baseline

Solar Systems API has been refactored to use the official EVE Frontier world API.

### Supported endpoints

- `GET /api/solar-systems`
- `GET /api/solar-systems/[id]`

### Removed endpoint

- `POST /api/solar-systems/sync`

### Current behavior

- Data source: `EVE_FRONTIER_WORLD_API_BASE_URL`
- List source path: `/v2/solarsystems`
- Detail source path: `/v2/solarsystems/{id}?format=json`
- Cache model: in-memory TTL cache on the server
- Force refresh: `refresh=true`

### Notes

- The old ESI-based design is obsolete.
- The old local file cache design is obsolete.
- The old manual sync script is obsolete.
- Node statistics for `nodes-map` are aggregated on the frontend from `/api/nodes`, not from `/api/solar-systems`.
