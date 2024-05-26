echo "Pulling Changes from Git Repoistry"
git pull
echo "Re-Installing Packages";
bun install
echo "Re-Generating & Updating Sqlite3 Database";
bunx prisma db push
echo "Restarting FLIX"
systemctl restart flix