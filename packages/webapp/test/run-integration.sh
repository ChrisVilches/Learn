#!/usr/bin/env bash

echo "Database:"
echo $DATABASE_URL
DB_HOST=$(node -e "console.log((new URL(process.env.DATABASE_URL)).host)")

# TODO: Things missing
# * Explain that `docker compose` should work (i.e. correct Docker version)
# * Execute `npx prisma generate`
# * Compile `problem-generator` package
# * Port may be already taken. Choose an even rarer port? Or make it random and then somehow use the same one for everything.

docker compose -f docker-compose.test.yml up -d --wait

postgres_ready() {
  $(which curl) http://$DB_HOST 2>&1 | grep '52' > /dev/null
}

until postgres_ready; do
  echo "Waiting for postgres server..."
  sleep 1
done

npx prisma migrate deploy
npx prisma generate
jest --config ./test/jest-e2e.json --runInBand
docker compose -f docker-compose.test.yml down --volumes
