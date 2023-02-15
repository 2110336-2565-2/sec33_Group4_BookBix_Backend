db.bookings.insertMany([
  {
    _id: ObjectId('000000000006000000000001'),
    customer_id: ObjectId('000000000001000000000001'),
    provider_id: ObjectId('000000000002000000000003'),
    start_date: new Date('2023-02-04T15:00:00.000Z'),
    duration: 2,
    status: 'pending',
  },
]);
