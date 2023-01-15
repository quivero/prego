#!/bin/bash

npm run hooks:prepare && \
npm ci && \
npm run build && \
npm audit fix && \
npm run db:init
