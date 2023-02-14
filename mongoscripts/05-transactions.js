db.transactions.insertMany([
  {
    _id: ObjectId('000000000005000000000001'),
    amount: 100,
    booking_id: ObjectId('000000000006000000000001'),
    date_created: new Date('2023-02-04T15:06:22.333Z'),
    status: 'pending',
    date_paid: null,
  },
]);
