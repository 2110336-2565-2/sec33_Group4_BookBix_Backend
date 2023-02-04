db.locations.insertMany([
  {
    _id: ObjectId('000000000004000000000001'),
    name: 'CU Centenary Park',
    address:
      'จุฬาลงกรณ์มหาวิทยาลัย ซอย จุฬาลงกรณ์ 5 Wang Mai, Pathum Wan, Bangkok 10330',
    description:
      'Designed to absorb flooding, this peaceful, modern park has cascading ponds & sloped walkways.',
    url: '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2441.5209365462138!2d100.52368429108087!3d13.738258848614372!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2992be834db29%3A0xb8059010c70b7e11!2sCU%20Centenary%20Park!5e0!3m2!1sen!2sth!4v1675494952889!5m2!1sen!2sth" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    images: [
      'https://lh5.googleusercontent.com/p/AF1QipPvqLLlhYiFleQH1xoxGVkP7ZUNQ3UfK05GfuG5=s532-k-no',
      'https://lh5.googleusercontent.com/p/AF1QipM0Li0Dxbo-6K46keYhJ6qwjmEXomUzr2_yfiKK=s488-k-no',
      'https://lh5.googleusercontent.com/p/AF1QipNvbC2xUfI5b90UiGVcYwMnJ3JH-9exYtz96eG8=s650-k-no',
    ],
    reviews: [
      {
        username: 'JohnDoe',
        rating: 4.0,
        text: 'CU Centenary Park is a beautiful and peaceful place to relax and enjoy the outdoors.',
      },
      {
        username: 'JaneDoe',
        rating: 5.0,
        text: "I love visiting CU Centenary Park, it's a must-see destination in Bangkok.",
      },
    ],
  },
  {
    _id: ObjectId('000000000004000000000002'),
    name: 'Eiffel Tower',
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
    description:
      "The Eiffel Tower is an iron tower located on the Champ de Mars in Paris, France. It was built as the entrance arch to the 1889 World's Fair.",
    url: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991629167957!2d2.289996628536379!3d48.858370013038396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2sth!4v1675496456369!5m2!1sen!2sth" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    images: [
      'https://www.travelandleisure.com/thmb/SPUPzO88ZXq6P4Sm4mC5Xuinoik=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/eiffel-tower-paris-france-EIFFEL0217-6ccc3553e98946f18c893018d5b42bde.jpg',
      'https://media.istockphoto.com/photos/eiffel-tower-in-spring-picture-id1297043676?b=1&k=20&m=1297043676&s=170667a&w=0&h=kXklVKUeWIw7UWDDYnxMzB3uXS9prFiea3RaRPyB5M0=',
      'https://i0.wp.com/thenexttrip.xyz/wp-content/uploads/2022/04/Trocadero-Stairs-Eiffel-Tower-View-2-820x1025.jpg',
    ],
    reviews: [
      {
        username: 'JohnDoe',
        rating: 4.5,
        text: 'Stunning view from the top of the tower. Highly recommend visiting.',
      },
      {
        username: 'JaneDoe',
        rating: 5.0,
        text: 'An iconic landmark of Paris. Must-visit when in the city.',
      },
    ],
  },
  {
    _id: ObjectId('000000000004000000000003'),
    name: 'Big Ben',
    address: 'Westminster, London SW1A 0AA, UK',
    description:
      'Big Ben is the nickname for the Great Bell of the clock at the north end of the Palace of Westminster in London.',
    url: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.680563427869!2d-0.12681408453473667!3d51.500729179634085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604c38c8cd1d9%3A0xb78f2474b9a45aa9!2sBig%20Ben!5e0!3m2!1sen!2sth!4v1675496421691!5m2!1sen!2sth" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    images: [
      'https://a.cdn-hotels.com/gdcs/production136/d901/aed471b7-d3fb-4047-ba62-909adeded756.jpg?impolicy=fcrop&w=800&h=533&q=medium',
      'https://tourism.com.de/wp-content/uploads/2021/11/big-ben-in-london.jpg',
      'https://media.istockphoto.com/id/629074798/photo/london-traffic-on-the-westminster-bridge.jpg?s=612x612&w=0&k=20&c=HdmkNhX5Bmz2SCjx0WIFueKWw9_TU4VFnk0jjBzV0MQ=',
    ],
    reviews: [
      {
        username: 'JohnDoe',
        rating: 4.0,
        text: 'An iconic landmark of London. Nice place for a photo op.',
      },
      {
        username: 'JaneDoe',
        rating: 4.5,
        text: 'Fantastic view from the river. Highly recommend taking a river cruise.',
      },
    ],
  },
  {
    _id: ObjectId('000000000004000000000004'),
    name: 'Central Park',
    address: 'New York, NY 10022',
    description: 'A large urban park in the heart of New York City',
    url: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.066385305769!2d-73.96777208496323!3d40.78255467932428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2589a018531e3%3A0xb9df1f7387a94119!2sCentral%20Park!5e0!3m2!1sen!2sth!4v1675496921164!5m2!1sen!2sth" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    images: [
      'https://ohny.org/wp-content/uploads/2022/09/Harry_Gillen_via_Unsplash.jpeg',
      'https://mymodernmet.com/wp/wp-content/uploads/2020/12/central-park-new-york-city-frederick-law-olmsted-2.jpg',
      'https://www.planetware.com/photos-large/USNY/new-york-city-central-park-1.jpg',
    ],
    reviews: [
      {
        username: 'JaneDoe',
        rating: 4.5,
        text: 'Beautiful park, lots of green spaces and a great place to relax.',
      },
      {
        username: 'JohnDoe',
        rating: 5.0,
        text: "One of the best parks I've ever been to. So much to do and see!",
      },
    ],
  },
]);
