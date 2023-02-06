rm -Force -Recurse ./data
docker-compose down -v
docker-compose up -d --build && docker rmi $(docker images -f dangling=true -q)