#!/bin/bash

PORT=2015

# Print message first, so it's visible even when the server starts
echo "Starting server with live-reload on http://localhost:$PORT"

# Start the server using npm script that we defined in package.json
npm run start