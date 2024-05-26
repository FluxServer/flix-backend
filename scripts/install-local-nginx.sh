mkdir /www
sudo ln -s "${PWD}" /www/

sudo apt install curl gnupg2 ca-certificates lsb-release ubuntu-keyring -y
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
sudo apt update
sudo apt install nginx -y

# install php
sudo apt install php8.1 php8.1-sqlite3 php8.1-opcache php8.1-mongodb php8.1-mbstring php8.1-mysql php8.1-curl php8.1-bz2 php8.1-cgi php8.1-uuid php8.1-fpm -y

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