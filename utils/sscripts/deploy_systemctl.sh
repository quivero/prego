#!/bin/bash

chmod 777 /lib/systemd/system/

echo "[Unit]
Description=quivero - making data-structure available
Documentation=https://github.com/quivero/quivero-api
After=network.target

[Service]
Environment=NODE_PORT=8080
Type=simple
User=ubuntu
ExecStart=/usr/bin/node /home/ec2-user/quivero-api/src/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target" >> /lib/systemd/system/quivero.service

systemctl enable quivero.service
systemctl start quivero.service