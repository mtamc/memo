/**
 * @file Utilities relating to values
 * which may be nullish (null/undefined).
 */

/** Apply function to a value if it is non-nullish */
const map = (nullable, fn) =>
  nullable !== null && nullable !== undefined
    ? fn(nullable)
    : nullable

window.Nullable = {
  map
}
