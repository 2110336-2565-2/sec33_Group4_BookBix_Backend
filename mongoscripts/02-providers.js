db.providers.insertMany([
  {
    _id: ObjectId('000000000002000000000001'),
    username: 'provider1',
    password: '$2b$10$R.RjKdvh9W4eZU/DR6cPiuLwBQCnlS7yUYz6Uc0EBCxjHm9fkmZ3u',
    email: 'provider1@example.com',
    date_created: '2023-02-04T12:34:56.789Z',
    organization_name: 'Provider Inc.',
    locations: [
      ObjectId('000000000004000000000001'),
      ObjectId('000000000004000000000002'),
    ],
  },
  {
    _id: ObjectId('000000000002000000000002'),
    username: 'provider2',
    password: '$2b$10$LKjyFAb5xvxnWOkX9AdZNOclRnLCI0nCvGz.HtYf3cg2nHxJxInWO',
    email: 'provider2@example.com',
    date_created: '2023-02-04T14:12:43.456Z',
    organization_name: 'Provider Co.',
    locations: [ObjectId('000000000004000000000003')],
  },
  {
    _id: ObjectId('000000000002000000000003'),
    username: 'provider3',
    password: '$2b$10$eAckQEbU6hOa6FGRHx7SOu9LbON3qBfQQbwV7B.cMgYV7RXYViRry',
    email: 'provider3@example.com',
    date_created: '2023-02-04T09:23:11.111Z',
    organization_name: 'Provider LLC',
    locations: [ObjectId('000000000004000000000004')],
  },
]);
