#!/bin/bash

# Generate a secure password
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 16)
PASSWORD_FILE="/www/flix/.msqd"

# Update package list and install MySQL
sudo apt-get update && sudo apt-get install -y mysql-server || { echo "Failed to install MySQL"; exit 1; }

# Secure MySQL installation
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}'; FLUSH PRIVILEGES;" || { echo "Failed to set MySQL root password"; exit 1; }

# Save the password to a file
echo "${MYSQL_ROOT_PASSWORD}" | sudo tee ${PASSWORD_FILE} || { echo "Failed to save MySQL root password"; exit 1; }

# Set appropriate permissions
sudo chmod 600 ${PASSWORD_FILE} || { echo "Failed to set permissions on password file"; exit 1; }

echo "MySQL installation and setup completed successfully."
