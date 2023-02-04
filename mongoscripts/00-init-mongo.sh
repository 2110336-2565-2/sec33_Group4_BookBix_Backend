echo '################ MONGO ENTRYPOINT START ################';
set -e

mongo <<EOF
    use $MONGO_INITDB_DATABASE

    db.createUser({
        user: '$MONGO_INITDB_USERNAME',
        pwd: '$MONGO_INITDB_PASSWORD',
        roles: [{
            role: 'readWrite',
            db: '$MONGO_INITDB_DATABASE'
        }]
    })

EOF

echo '################ MONGO ENTRYPOINT END ################';