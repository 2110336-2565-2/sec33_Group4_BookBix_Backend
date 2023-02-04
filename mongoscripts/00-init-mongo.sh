#FOR WHOM TO USE/EDIT THIS SCRIPT
#THE END OF LINE MUST BE LF, NOT CRLF
echo '################ MONGO ENTRYPOINT START ################';
echo 'CREATING USER:'$MONGO_INITDB_USERNAME;
mongo -- <<EOF
    use admin;
    db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD');
    use $MONGO_INITDB_DATABASE;

    db.createUser({
      user: '$MONGO_INITDB_USERNAME',
      pwd: '$MONGO_INITDB_PASSWORD',
      roles: ["readWrite"]
    });
EOF
echo '################ MONGO ENTRYPOINT END ################';