#!/bin/bash

# Update packages and packages.json
npm i -g npm-check-updates
ncu -u && npm update

# Submit to git
git add .
git commit -m 'config/ package.json'
git push