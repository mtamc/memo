// Test file, will be deleted
exports.handler = async () => {
  try {
    return {
      statusCode: 200,
      body: "test"
    }
  }
  catch (err) {
    return {
      statusCode: 547,
      body: `err:::${err}`
    }
  }
}

// const dummy = [
  // {
    // commonMetadata: {
      // id: '0',
      // entryType: 'Game',
      // originalTitle: 'Fake title',
      // englishTranslatedTitle: 'English fake title',
      // duration: 2.5,
      // imageUrl: 'https://preview.redd.it/y5tsbhhdmla81.jpg',
      // genres: ['rpg', 'fps'],
      // studio: ['Bethesda'],
    // },
    // score: 8
  // },
  // {
    // commonMetadata: {
      // id: '1',
      // entryType: 'Game',
      // originalTitle: 'Fake title 2',
      // englishTranslatedTitle: 'English fake title 2',
      // duration: 1,
      // imageUrl: 'https://i.redd.it/i30zk1372na81.jpg',
      // genres: ['adventure'],
      // studio: ['Bethesda'],
    // },
    // score: 4,
  // },
// ]
