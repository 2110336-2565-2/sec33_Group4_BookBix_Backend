docker-compose -f docker-compose.prod.yml build
docker rmi $(docker images -f dangling=true -q)