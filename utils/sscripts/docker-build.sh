#!/bin/sh

yum install docker
systemctl start docker.service
systemctl enable docker.service 