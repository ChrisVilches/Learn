# Learn App

[![Netlify Status](https://api.netlify.com/api/v1/badges/4181054b-f24b-4bb3-8124-bd493304b60e/deploy-status)](https://app.netlify.com/sites/chrisvilches-learn/deploys)

Learning app. Generates math problems and tests your skills.

It works similar to an online judge. Problems are generated based on chosen topic.

Made with TypeScript, NestJS and React.

## Deployment

### Frontend App (React)

Example of how to set environment variables:

```sh
VITE_BASE_URL=http://localhost:3000 npm run dev
```

### Web App (NestJS)

Example of how to deploy using Docker.

Setup database:

```sh
DATABASE_URL=postgresql://postgres:mypass@172.25.0.2:5432/learn_dev?schema=public
SECRET_KEY=abcdefghijkl

docker build --target db -t webapp-setup .
docker run --rm --env DATABASE_URL=$DATABASE_URL --network=custom_network1 webapp-setup
```

Run app:

```sh
docker build --target app -t webapp-run .
docker run -dit -p 3007:3000 --env ALLOW_HOST=https://learn.chrisvilches.com --env DATABASE_URL=$DATABASE_URL --env SECRET_KEY=$SECRET_KEY --network=custom_network1 --name webapp webapp-run
```

## Testing

### `problem-generator` unit tests

Make sure to pass the `PYTHON_CMD` (Python interpreter path) environment variable:

```sh
PYTHON_CMD=/usr/bin/python3 npm run test --prefix ./packages/problem-generator
```

### `webapp` integration tests

Make sure Docker (at least version 24.0.7) is installed.

Compile the `problem-generator` package:

```sh
npm run build --prefix ./packages/problem-generator/
```

Run:

```sh
npm run test:e2e --prefix ./packages/webapp/
```

## Troubleshooting

### Use `ts-node`, not `tsx` for scripts

Using `tsx` for some reason doesn't inject dependencies correctly (they become `undefined` and crashes).

This may be related to decorator related configurations when compiling and executing TS code. Since dependency injection uses reflection, decorators and metadata are necessary, and `tsx` may be omitting that.
