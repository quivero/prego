#!/bin/bash

sudo yum install curl -y 

curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc

curl –sL https://rpm.nodesource.com/setup_10.x | sudo bash -
sudo yum install –y nodejs

nvm install lts/*

echo NPM version: $(npm -v)
echo "NVM version: $(nvm --version)"
echo "NodeJS version: $(node -v)"

