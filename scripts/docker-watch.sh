#!/bin/bash

if [[ $# -eq 0 ]];
  then echo 'Container image name not supplied'
elif docker ps -a | grep -qw "$1"; then

  if [[ $(docker ps -a | grep -w "$1" | wc -l) -eq 1  ]]; then
    container_id=$(docker ps -a | grep -w "$1" | head -n1 | awk "{print $1;}");

    echo "Container image $IMAGE_NAME with ID $container_id exists!"
    docker logs -f "$container_id"
  else
    echo "We found more than one container with name $IMAGE_NAME."
    echo $(docker ps -a | grep -w "$1")
    echo 'We recommend you to watch it manually with command: '
    echo './utils/scripts/docker-watch.sh IMAGE_NAME'
  fi;

else
  echo "No such container $1"
fi;
