db.bookings.insertMany([
  {
    _id: ObjectId('b000000001'),
    customer_id: ObjectId('000000000001000000000001'),
    location_id: ObjectId('000000000004000000000004'),
    start_date: new Date('2023-02-04T15:00:00.000Z'),
    duration: 2,
    status: 'pending',
  },
]);
