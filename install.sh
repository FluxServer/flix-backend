# Flix v0.1 Installer

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Dependencies
    sudo apt install libssl-dev build-essential git

    curl -fsSL https://bun.sh/install | bash

    sudo ln -s "${HOME}/.bun/bin/bun" /usr/bin
    sudo ln -s "${HOME}/.bun/bin/bunx" /usr/bin

    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

    nvm install 20
    nvm use 20

    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

    export PATH=$PATH:"${HOME}/.cargo/bin";

    mkdir /www

    cd /www

    git clone https://github.com/FluxServer/flix-backend flix

    cd flix

    cargo build --release

    bun install

    bun run ./src/setup.ts

    bunx prisma db push
    
    mkdir user_dir

    echo "Installing Nginx"

    ./scripts/install-local-nginx.sh

    sudo ln -s ./src/templates/flix.service /etc/systemd/system

    sudo systemctl enable flix
    sudo systemctl start flix

    echo "Installation Successfull of Flix."

elif [[ "$OSTYPE" == "darwin"* ]]; then
    curl -fsSL https://bun.sh/install | bash


elif [[ "$OSTYPE" == "win32" ]]; then
    echo "Flix Installation is not supported through bash/sh on Windows Yet"
else
    echo "Unknown OS Found";
fi