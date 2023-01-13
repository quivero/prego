#!/bin/bash

IMAGE_NAME="$1"
FROM_PORT="$2"
TO_PORT="$3"

if [[ $# -eq 0 ]]; then
  echo "Provide Docker image name, local listen port and output port!"

elif docker ps -a | grep -qw "$1"; then
  container_id=$(docker ps -a | grep -w "$1" | head -n1 | awk "{print $1;}");

  echo "Container image $IMAGE_NAME with ID $container_id already exists! Watch it below."
  bash "$(pwd)/scripts/docker-watch.sh" "$container_id"

else
  echo "No such container image $1 yet"

  docker build -t "$IMAGE_NAME" .
  docker run -p "$FROM_PORT:$TO_PORT" -d "$IMAGE_NAME"
fi;
