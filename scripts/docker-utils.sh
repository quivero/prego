#!/bin/bash

# Remove dangling and stopped docker content
#
# examples:
#   >> sanitize # 0 (success)
#   Deleted Containers:
#   container_xpto
#
#   Deleted Networks:
#   network_xpto
#
#   Deleted Volumes:
#   volume_xpto
#
#   Total reclaimed space: 0B
sanitize() {
  docker system prune --volumes -f

  for image_id in $(docker images --filter 'dangling=true' -q --no-trunc); do
    docker rmi "$image_id"
  done
}

# List containers with certain text snippet on containername
#
# examples:
#   >> list container_name_snippet
#   container_id_1
#   container_id_2
list() {
    docker ps -a | grep "$1" | awk '{ print $1 }'
}

# stopAndRemoveContainer
#
# examples:
#   >> purge container_id # 0/1 (success/fail)
purge() {
    docker stop "$1" && docker rm "$1"
}

export -f sanitize
export -f list
export -f purge
