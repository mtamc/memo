// const responses = require('../utils/responses')
exports.handler = (a, b) => {
  try {
    return { statusCode: 200, body: `Hello from a serverless function!` };
  } catch (err) {
    return { statusCode: 500, body: "errrrrr " + err.toString() };
  }
}
// exports.handler = ({}, {}, cb) => cb(responses.ok(JSON.stringify(dummy)))

// const dummy = [
  // {
    // commonMetadata: {
      // id: '0',
      // entryType: 'Movie',
      // originalTitle: 'Fake movie',
      // englishTranslatedTitle: 'English fake movie',
      // duration: 2.5,
      // imageUrl: 'https://preview.redd.it/y5tsbhhdmla81.jpg',
      // genres: ['drama', 'thriller'],
      // staff: ['Woody Allen']
    // },
    // score: 7
  // },
  // {
    // commonMetadata: {
      // id: '1',
      // entryType: 'Movie',
      // originalTitle: 'Fake movie 2',
      // englishTranslatedTitle: 'English fake movie 2',
      // duration: 1,
      // imageUrl: 'https://i.redd.it/i30zk1372na81.jpg',
      // genres: ['adventure', 'superhero'],
      // staff: ['Robert Downey Jr.']
    // },
    // score: 5,
  // },
// ]
