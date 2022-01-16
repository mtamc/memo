/** This file only exists for developer reference. */

interface Work { // IDs are Fauna refs, present in parent
  entryType: 'Game' | 'Film' | 'TVShow' | 'Book'

  // retrieved with external api
  englishTranslatedTitle: string
  originalTitle?: string
  releaseYear?: number
  duration?: number // hours
  imageUrl?: string
  genres?: string[]

  // Notably absent
  // wikipediaUrl => Generated with Feeling Lucky
}

interface Game extends Work {
  entryType: 'Game'

  // retrieved with external api
  platforms?: string[]
  studios?: string[] // Linked with Wikipedia Feeling Lucky
  publishers?: string[] // Linked with Wikipedia Feeling Lucky
}

interface Film extends Work {
  entryType: 'Film'

  // retrieved with external api
  staff?: string[] // Full data..? Linked with Wikipedia Feeling Lucky
             // Filtered by whitelist at DB query time or table render time
}

interface TVShow extends Work {
  entryType: 'TVShow'

  // retrieved with external api
  staff?: [] // same as Film
  episodes?: number
}

interface Book extends Work {
  entryType: 'Book'
  // duration in words maybe?

  // retrieved with external api
  authors?: string[]
}

interface UserListEntry<EntryType extends Work> {
  commonMetadata: EntryType

  // User-specific data
  userId: string
  status: 'InProgress' | 'Completed' | 'Dropped' | 'Planned'
  score?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  startedDate?: number // UNIX Timestamp
  completedDate?: number // Unix Timestamp
  review?: string
}

type UserList<EntryType extends Work> =
  UserListEntry<EntryType>[]
