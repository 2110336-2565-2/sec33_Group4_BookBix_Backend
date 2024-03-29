db.providers.insertMany([
  {
    _id: ObjectId('000000000002000000000001'),
    username: 'provider1',
    password: '$2a$12$rCMpOnOuZMulEy.SrzMH7.mx3gzWgwVh96EgIuKuvYXI7A.9SBJJK', //test123
    email: 'provider1@example.com',
    date_created: new Date('2023-02-04T12:34:56.789Z'),
    organization_name: 'Provider Inc.',
    locations: [
      ObjectId('000000000004000000000001'),
      ObjectId('000000000004000000000002'),
    ],
    stripe_account_id: 'acct_1Msp19Q6hJlrjKYC',
    device_history: ['WINDOWS - CHROME - 192.168.0.1'],
  },
  {
    _id: ObjectId('000000000002000000000002'),
    username: 'provider2',
    password: '$2a$12$rCMpOnOuZMulEy.SrzMH7.mx3gzWgwVh96EgIuKuvYXI7A.9SBJJK', //test123
    email: 'provider2@example.com',
    date_created: new Date('2023-02-04T14:12:43.456Z'),
    organization_name: 'Provider Co.',
    locations: [ObjectId('000000000004000000000003')],
    stripe_account_id: 'acct_1Msp63Q3c3AKfNRa',
    device_history: ['WINDOWS - CHROME - 192.168.0.1'],
  },
  {
    _id: ObjectId('000000000002000000000003'),
    username: 'provider3',
    password: '$2a$12$rCMpOnOuZMulEy.SrzMH7.mx3gzWgwVh96EgIuKuvYXI7A.9SBJJK', //test123
    email: 'provider3@example.com',
    date_created: new Date('2023-02-04T09:23:11.111Z'),
    organization_name: 'Provider LLC',
    locations: [ObjectId('000000000004000000000004')],
    stripe_account_id: 'acct_1MsoqgPqkVkOUZkn',
    device_history: ['WINDOWS - CHROME - 192.168.0.1'],
  },
  
]);
