# BookBix_Backend

### Development Setups

##### Docker up
```bash
docker-compose up -d --build && docker rmi $(docker images -f “dangling=true” -q)
```

##### Docker down
```bash
docker-compose down -v
```

Current tech list
- Nest js
- Mongodb
- Docker


# !! DO NOT TOUCH DOCKER FILE !!