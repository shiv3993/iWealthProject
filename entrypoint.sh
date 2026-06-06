#!/bin/sh
set -e

echo "Running script 1..."
node src/scripts/importNav.js

echo "Running script 2..."
node src/scripts/importBenchmark.js

echo "Starting application..."
exec "$@"