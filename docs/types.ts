/** This file only exists for developer reference. */

interface Work {
   // internally attributed
  id: string
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
  studio?: string[] // Linked with Wikipedia Feeling Lucky
  publisher?: string[] // Linked with Wikipedia Feeling Lucky
}

interface Film extends Work {
  entryType: 'Film'

  // retrieved with external api
  staff?: [] // Full data..? Linked with Wikipedia Feeling Lucky
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
  author?: string
}

interface UserListEntry<EntryType extends Work> {
  commonMetadata: EntryType

  // User-specific data
  userId: string
  status: 'InProgress' | 'Completed' | 'Dropped' | 'Planned'
  score?: number
  startedDate?: number // UNIX Timestamp
  completedDate?: number // Unix Timestamp
  review?: string
}

type UserList<EntryType extends Work> =
  UserListEntry<EntryType>[]
