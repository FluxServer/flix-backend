# Download MongoDB Community Edition from MongoDB Servers
mkdir user_dir

wget https://repo.mongodb.org/apt/ubuntu/dists/jammy/mongodb-org/7.0/multiverse/binary-amd64/mongodb-org-server_7.0.9_amd64.deb -O user_dir/.temp.mongodb.deb

openssl rand -base64 756 > user_dir/mongodb.key
sudo chmod 400 user_dir/mongodb.key

# sudo cp src/templates/mongodb.conf /etc/mongodb.conf
# sudo cp src/templates/mongod.service /lib/systemd/system/mongod.service

# mongosh --eval 'db.createUser( { user: "root", pwd: "1939pd993", roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ] } )'

# sudo systemctl daemon-reload