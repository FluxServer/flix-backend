export MYSQL_URI="https://dev.mysql.com/get/Downloads/MySQL-8.4/mysql-server_8.4.0-1ubuntu22.04_amd64.deb-bundle.tar";

wget $MYSQL_URI -o user_dir/mysql.deb

sudo apt install ./user_dir/mysql.deb