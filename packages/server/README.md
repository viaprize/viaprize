# pact-indexer

## Usage

```
npx ts-node src/index.ts
```

Pass `--help` to see the various flags and config. Both CLI flags and
env vars can be used to configure the service.

THIS HAS AN IN MEMORY DATABASE. DO NOT RESTART SERVER FOR NOW

## API

- `GET /api/pact`
- `GET /api/pacts`
- `POST /api/pact`

## Roadmap

- sqlite database indexes all pacts on an interval
- frontend calls `POST /api/pact` to save metadata
- handle reorgs effectively (must for good ux)

## Development

Use `direnv`, create an `.envrc` with the following fields:

```
export PACT_SERVER__RPC_PROVIDER=
export PACT_SERVER__PACT_FACTORY_ADDRESS=
```

### How to use direnv

1. Install
curl -sfL https://direnv.net/install.sh | bash

2. Add Permission
chmod +x direnv

3. Exec
direnv .envrc