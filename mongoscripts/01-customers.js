db.customers.insertMany([
  {
    _id: ObjectId('000000000001000000000001'),
    firstname: 'John',
    lastname: 'Doe',
    sex: 'Male',
    birthdate: '1985-03-15',
    username: 'johndoe85',
    password: '$2a$12$rCMpOnOuZMulEy.SrzMH7.mx3gzWgwVh96EgIuKuvYXI7A.9SBJJK', //test123
    email: 'johndoe85@gmail.com',
    date_created: '2022-12-01T10:00:00.000Z', //Stored in ISO format
  },
  {
    _id: ObjectId('000000000001000000000002'),
    firstname: 'Jane',
    lastname: 'Smith',
    sex: 'Female',
    birthdate: '1990-07-20',
    username: 'janesmith90',
    password: '$2a$12$rCMpOnOuZMulEy.SrzMH7.mx3gzWgwVh96EgIuKuvYXI7A.9SBJJK', //test123
    email: 'janesmith90@gmail.com',
    date_created: '2022-11-15T11:30:00.000Z',
  },
  {
    _id: ObjectId('000000000001000000000003'),
    firstname: 'Michael',
    lastname: 'Johnson',
    sex: 'Male',
    birthdate: '1995-01-10',
    username: 'michaelj95',
    password: '$2a$12$rCMpOnOuZMulEy.SrzMH7.mx3gzWgwVh96EgIuKuvYXI7A.9SBJJK', //test123
    email: 'michaelj95@gmail.com',
    date_created: '2022-10-20T09:00:00.000Z',
  },
  {
    _id: ObjectId('000000000001000000000004'),
    firstname: 'Emily',
    lastname: 'Brown',
    sex: 'Female',
    birthdate: '1992-06-05',
    username: 'emilybrown92',
    password: '$2a$12$rCMpOnOuZMulEy.SrzMH7.mx3gzWgwVh96EgIuKuvYXI7A.9SBJJK', //test123
    email: 'emilybrown92@gmail.com',
    date_created: '2022-09-10T14:00:00.000Z',
  },
  {
    _id: ObjectId('000000000001000000000005'),
    firstname: 'David',
    lastname: 'Williams',
    sex: 'Male',
    birthdate: '1987-12-25',
    username: 'davidw87',
    password: '$2a$12$rCMpOnOuZMulEy.SrzMH7.mx3gzWgwVh96EgIuKuvYXI7A.9SBJJK', //test123
    email: 'davidw87@gmail.com',
    date_created: '2022-10-20T09:00:00.000Z',
  },
])
