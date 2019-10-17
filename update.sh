echo "Updating Web ..."
git pull origin master
docker-compose down
docker-compose up -d --force-recreate --build