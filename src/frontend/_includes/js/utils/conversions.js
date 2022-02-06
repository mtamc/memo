const typeToTitle = {
  films: 'Films',
  books: 'Literature',
  games: 'Video Games',
  tv: 'TV Shows',
}

const typeToAPIType = {
  films: 'Film',
  books: 'Book',
  games: 'Game',
  tv: 'TVShow',
}

const apiTypeToType = {
  'Film': 'films',
  'Book': 'books',
  'Game': 'games',
  'TVShow': 'tv',
}


const statusToTitle = (entryType, status) => ({
  InProgress: {
    films: 'Watching',
    tv: 'Watching',
    games: 'Playing',
    books: 'Reading'
  }[entryType],
  Completed: 'Completed',
  Dropped: 'Dropped',
  Planned: {
    films: 'To watch',
    tv: 'To watch',
    games: 'To play',
    books: 'To read'
  }[entryType]
}[status])


Conversions = {
  typeToTitle,
  typeToAPIType,
  statusToTitle,
  apiTypeToType,
}
