#!/bin/bash

IMAGE_NAME=$1

if [[ $# -eq 0 ]]; then 
	echo "Provide Docker image name!" 

elif docker ps -a | grep -qw "$1"; then
	if [[ $(docker ps -a | grep -w $1 | wc -l) -eq 1  ]]; then
		container_id=$(docker ps -a | grep -w $1 | head -n1 | awk '{print $1;}');
		
		echo "Container image $IMAGE_NAME with ID $container_id exists!"
		echo "We will stop and remove from active images."

		docker stop $container_id && docker rm $container_id
	else
		echo "We found more than one container with name $IMAGE_NAME."
		echo $(docker ps -a | grep -w $1)
		echo "We recommend you to resolve it manually with command: "
		echo "docker stop CONTAINER_ID && docker rm CONTAINER_ID"

	fi;
else
	echo "No such container image $1 yet"
fi;

