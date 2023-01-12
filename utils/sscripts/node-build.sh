#!/bin/bash

BASEDIR=$(dirname "$0")
source "${BASEDIR}/linux-utils.sh"

NODE_VERSION="16"
NVM_VERSION="18.12.1"

# Verifies if command runs as sudo
sh_c=$( get_if_root )

os_install_repo="$(echo "$( os_info )" | awk "{ print $3 }" FS=":")"

# Install curl if not already present
$sh_c "$os_install_repo install curl -y"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash

# Retrieve necessary repositories
$sh_c "curl curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash"
$sh_c "export NVM_DIR=\"$HOME/.nvm\""
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

source ~/.bashrc

# Install node
$sh_c "curl https://deb.nodesource.com/setup_$NODE_VERSION.x | sudo bash - "
$sh_c "$os_install_repo install -y nodejs"
$sh_c "$os_install_repo install -y gcc g++ make"

# Install nvm
nvm install "18.12.1" --reinstall-packages-from=current -y --latest-npm

echo "=================================================================="

# Echo library versions
echo NPM version: $(npm -v)
echo NVM version: $(nvm --version)
echo NodeJS version: $(node -v)

echo "=================================================================="

# Add node binaries to OS path
export PATH=$PATH:$(npm bin -g)

npm install -g pm2
