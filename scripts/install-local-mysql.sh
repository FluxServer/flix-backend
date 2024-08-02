#!/bin/bash

# Generate a secure password
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 12)
PASSWORD_FILE="/www/flix/.msqd"

# Update package list and install MySQL
sudo apt-get update
sudo apt-get install -y mysql-server

# Secure MySQL installation
# Use default auth and then change password
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}'; FLUSH PRIVILEGES;"

# Save the password to a file
echo "${MYSQL_ROOT_PASSWORD}" | sudo tee ${PASSWORD_FILE}

# Set appropriate permissions
sudo chmod 600 ${PASSWORD_FILE}
