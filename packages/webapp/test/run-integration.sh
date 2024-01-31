#!/usr/bin/env bash

echo "Database:"
echo $DATABASE_URL
DB_HOST=$(node -e "console.log((new URL(process.env.DATABASE_URL)).host)")

docker compose -f docker-compose.test.yml up -d --wait

postgres_ready() {
  $(which curl) http://$DB_HOST 2>&1 | grep '52' > /dev/null
}

until postgres_ready; do
  echo "Waiting for postgres server..."
  sleep 1
done

npx prisma migrate deploy
jest --config ./test/jest-e2e.json --runInBand
docker compose -f docker-compose.test.yml down --volumes
