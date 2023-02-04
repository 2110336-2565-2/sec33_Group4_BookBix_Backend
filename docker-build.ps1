docker login
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml push
docker rmi $(docker images -f dangling=true -q)