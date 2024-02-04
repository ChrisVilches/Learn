# Learn App

Learning app. Generates math problems and tests your skills.

It works similar to an online judge. Problems are generated based on chosen topic.

Made with TypeScript, NestJS and React.

## Deployment

### Web App (NestJS)

Example of how to deploy using Docker:

```sh
docker build -t webapp .

# Use port 3007 on the host machine
docker run -dit -p 3007:3000 --name webapp-production webapp
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
