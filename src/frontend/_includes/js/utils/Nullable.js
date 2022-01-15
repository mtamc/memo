window.Nullable = {
  map: (nullable, fn) =>
    nullable !== null && nullable !== undefined ? fn(nullable) : nullable,
}
