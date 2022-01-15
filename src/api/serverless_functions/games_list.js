// const responses = require('../utils/responses')

const response = (statusCode) => (body) => ({ statusCode, body })

const responses = {
  ok: response(200),
  badRequest: response(400),
  internalError: response(500),
}

exports.handler = () => responses.ok(JSON.stringify(dummy))

const dummy = [
  {
    commonMetadata: {
      id: '0',
      entryType: 'Game',
      originalTitle: 'Fake title',
      englishTranslatedTitle: 'English fake title',
      duration: 2.5,
      imageUrl: 'https://preview.redd.it/y5tsbhhdmla81.jpg',
      genres: ['rpg', 'fps'],
      studio: ['Bethesda'],
    },
    score: 8
  },
  {
    commonMetadata: {
      id: '1',
      entryType: 'Game',
      originalTitle: 'Fake title 2',
      englishTranslatedTitle: 'English fake title 2',
      duration: 1,
      imageUrl: 'https://i.redd.it/i30zk1372na81.jpg',
      genres: ['adventure'],
      studio: ['Bethesda'],
    },
    score: 4,
  },
]
