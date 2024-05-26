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
sudo apt install php8.3 php8.3-sqlite3 php8.3-opcache php8.3-mongodb php8.3-mbstring php8.3-mysql php8.3-curl php8.3-bz2 php8.3-cgi php8.3-uuid php8.3-fpm -y

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