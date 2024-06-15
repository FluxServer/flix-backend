mkdir /www
sudo ln -s "${PWD}" /www/

sudo apt install curl gnupg2 ca-certificates lsb-release ubuntu-keyring -y

sudo apt update
sudo apt install nginx-full -y
source /etc/os-release
if [ "$VERSION_ID" == "22.04" ]; then
    echo "VERSION_ID is 22.04"
    sudo apt install php8.1 php8.1-sqlite3 php8.1-opcache php8.1-mongodb php8.1-mbstring php8.1-mysql php8.1-curl php8.1-bz2 php8.1-cgi php8.1-uuid php8.1-fpm -y
elif [ "$VERSION_ID" == "24.04" ]; then
    echo "VERSION_ID is 24.04"
    # install php
    sudo apt install php8.3 php8.3-sqlite3 php8.3-opcache php8.3-mongodb php8.3-mbstring php8.3-mysql php8.3-curl php8.3-bz2 php8.3-cgi php8.3-uuid php8.3-fpm -y
else
    echo "VERSION_ID is neither 22.04 nor 24.04"
    # Add any other commands for other versions here
fi

# init nginx dir here
mkdir user_dir/sites-available
mkdir user_dir/sites
mkdir user_dir/sites/default

echo "<h5>Default Website for Flix</h5>" > user_dir/sites/default/index.html
systemctl restart nginx
echo "Symlink Created"
sudo rm /etc/nginx/nginx.conf
sudo cp src/nginx.conf /etc/nginx/nginx.conf
sudo cp src/default.nginx.conf user_dir/sites-available/default

sudo adduser --system --no-create-home --shell /bin/false --group --disabled-login www
