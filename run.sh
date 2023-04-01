#!/bin/sh

# Set a default host port if no argument is provided
HOST_PORT=${1:-3888}

# Run the Docker container with the specified host port
docker run -p $HOST_PORT:3888 requestq