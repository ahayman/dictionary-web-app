declare global {
  interface Array<T> {
    /**
     * A cleaner way than reduce to take an array of values and turn them into an object.
     * Most often, this is done to essentially 'map' an array to a dictionary of values
     *
     * @description This function essentially uses a reduce to take the object and fold the accumulated
     * values along with the newly mapped object values into a single whole using the { ...accumulated, ...mappedObject } syntax.
     *
     * @param init The initial object to use.  It will become the accumulator in the reduce function.
     * @param map Map the value to an object.
     */
    objectify<U extends Record<string, unknown>>(
      map: (item: T) => Partial<U>
    ): U

    /**
     * A cleaner way to check if an array contains a value.
     * Usefull in boolean expresions
     * @param item The value to check
     */
    contains(item: T): boolean

    /**
     * A clean way to check if an item exists within an array.
     * Use this instead of 'contains' if your object won't match
     * (ex: you want to match on an ID or something similar)
     * @param include Whether to include the item
     */
    containsAny(include: (item: T) => boolean): boolean

    /**
     * This is also a convenience function that helps clean up code.
     * It's common to need to turn an array of items into an array of
     * promises, forcing you to wrap the entire thing in a Promise.all().
     * If further transformations are needed, then the code can get difficult to look at.
     * This inlines the promises and wraps then with Promise.all().
     * @param map Should take an item and convert it into a promise
     */
    awaitMap<U>(map: (item: T) => Promise<U>): Promise<U[]>

    /**
     * Compares current array (this) to another array by using the provided comparater
     * and comparing each item in the arrays in order.
     * @param arr Another array
     * @param comparator A function that takes a value from both arrays and returns whether the two are equal
     */
    equalTo<U>(
      arr: Array<U>,
      comparator: (left: T, right: U) => boolean
    ): boolean

    /**
     * A simple way to sort without having to remember what numbers to return for ascending/descending.
     * @param direction The direction you wish to sort: asc or desc
     * @param key If provided, return a value upon which to sort. If nothing is provided, the array is sorted
     * directly on the objects in it.
     */
    sortOn<U>(direction: "asc" | "desc", key?: (value: T) => U): Array<T>

    /**
     * Convenience function that returns the last index (length - 1)
     * Will return -1 if the array is empty
     */
    lastIndex(): number

    /**
     * Convenience function to get the first element of the array.
     */
    first(): T | undefined

    /**
     * Convenience function to get the last element of the array.
     * Assumes the array is not empty and accesss elements directly using subscripts.
     * Literally: this[this.lastIndex()], but `last()` is more readable and doesn't
     * require a separate reference to the variable (can be inlined)
     */
    last(): T

    /**
     * Takes the array, and interlaces between each item an additional joined item
     * returned from the joiner function.
     * This is useful for interleaving something like a divider between items.
     * @param joiner
     */
    joinWith(joiner: (item: T) => T | undefined): T[]

    /**
     * Split the array into two using a function that returns either left or right for
     * each item.
     * @param spliter takes an item of the array and returns whether it should be added to left or right
     */
    split(spliter: (item: T) => "left" | "right"): [Array<T>, Array<T>]

    // Removes an item from the array
    remove(item: T): boolean

    // Removes all items provides from the array
    removeAll(items: T[]): number

    /**
     * This will return a new array without the indexed item
     * If the index doesn't match, this will return `this`
     * @param item
     */
    removingIndex(index: number): T[]

    // removes all items that match the condition
    removeWhere(match: (item: T) => boolean): number

    // removes the first matching item from the array and returns it
    removingFirst(match: (item: T) => boolean): T | undefined

    /**
     * Chaining operator, removes items that match and
     * returns the resulting array.
     * If no items match, `this` is returned (not a new array)
     * @param match
     */
    removingWhere(match: (item: T) => boolean): T[]

    /**
     * Chaining operator, updates items that match and
     * returns the resulting array.
     * If no items match, `this` is returned (not a new array)
     * @param match
     */
    updating(item: Partial<T>, where: (item: T) => boolean): T[]

    /**
     * This will replace an item if there are any matches or
     * insert an item if there are no matches.
     * @param item The item to insert or replace
     * @param where matches existing item(s)
     */
    upsertWhere(item: T, where: (item: T) => boolean): T[]
  }
}

Array.prototype.lastIndex = function lastIndex<T>(this: T[]): number {
  return this.length - 1
}

Array.prototype.first = function get<T>(this: T[]): T | undefined {
  if (this.length === 0) {
    return
  }
  return this[0]
}

Array.prototype.last = function get<T>(this: T[]): T {
  return this[this.lastIndex()]
}

Array.prototype.objectify = function objectify<
  T,
  U extends Record<string, unknown>
>(this: T[], map: (item: T) => Partial<U>): U {
  return this.reduce((a, v) => ({ ...a, ...map(v) }), {} as U)
}

Array.prototype.contains = function contains<T>(this: T[], item: T): boolean {
  return this.findIndex((v) => item === v) > -1
}

Array.prototype.containsAny = function containsAny<T>(
  this: T[],
  include: (item: T) => boolean
): boolean {
  for (const item of this) {
    if (include(item)) {
      return true
    }
  }
  return false
}

Array.prototype.awaitMap = function awaitMap<T, U>(
  this: T[],
  map: (item: T) => Promise<U>
): Promise<U[]> {
  return Promise.all(this.map(map))
}

Array.prototype.equalTo = function equalTo<T, U>(
  this: T[],
  arr: Array<U>,
  comparator: (l: T, r: U) => boolean
): boolean {
  if (this.length !== arr.length) {
    return false
  }
  for (let i = 0; i < this.length; i++) {
    if (!comparator(this[i], arr[i])) {
      return false
    }
  }
  return true
}

Array.prototype.sortOn = function sortOn<T, U>(
  this: T[],
  direction: "asc" | "desc",
  key?: (value: T) => U
): Array<T> {
  return this.sort((left, right) => {
    const [l, r] = key ? [key(left), key(right)] : [left, right]
    switch (direction) {
      case "asc":
        if (l < r) {
          return -1
        }
        if (l > r) {
          return 1
        }
        return 0
      case "desc":
        if (l < r) {
          return 1
        }
        if (l > r) {
          return -1
        }
        return 0
    }
  })
}

Array.prototype.split = function split<T>(
  this: T[],
  splitter: (item: T) => "left" | "right"
): [Array<T>, Array<T>] {
  const left: T[] = []
  const right: T[] = []
  for (const item of this) {
    if (splitter(item) === "left") {
      left.push(item)
    } else {
      right.push(item)
    }
  }
  return [left, right]
}

Array.prototype.removingIndex = function removingIndex<T>(
  this: T[],
  index: number
): T[] {
  if (this.length === 0 || index < 0 || index >= this.length) {
    return this
  }
  const arr = [...this]
  arr.splice(index, 1)
  return arr
}

Array.prototype.remove = function remove<T>(this: T[], item: T): boolean {
  const idx = this.indexOf(item)
  if (idx < 0) {
    return false
  } else {
    this.splice(idx, 1)
    return true
  }
}

Array.prototype.removeAll = function removeAll<T>(
  this: T[],
  items: T[]
): number {
  const idxs = items
    .map((item) => this.indexOf(item))
    .filter((idx) => idx > -1)
    .sortOn("desc")
  for (const idx of idxs) {
    this.splice(idx, 1)
  }
  return idxs.length
}

Array.prototype.removingWhere = function removingWhere<T>(
  this: T[],
  match: (item: T) => boolean
): T[] {
  const idxs = this.map((item, index) => (match(item) ? index : -1))
    .filter((idx) => idx > -1)
    .sortOn("desc")
  if (idxs.length === 0) {
    return this
  }
  const arr = [...this]
  for (const idx of idxs) {
    arr.splice(idx, 1)
  }
  return arr
}

Array.prototype.removingFirst = function removingFirst<T>(
  this: T[],
  match: (item: T) => boolean
): T | undefined {
  const idx = this.findIndex(match)
  if (idx === -1) return undefined
  const item = this[idx]
  this.splice(idx, 1)
  return item
}

Array.prototype.updating = function updating<T>(
  this: T[],
  item: Partial<T> | T,
  match: (item: T) => boolean
): T[] {
  const idxs = this.map((item, index) => (match(item) ? index : -1)).filter(
    (idx) => idx > -1
  )
  if (idxs.length === 0) {
    return this
  }
  const arr = [...this]
  for (const idx of idxs) {
    const i = arr[idx]
    if (typeof i === "object") {
      arr[idx] = { ...i, ...item }
    } else {
      // If not an object, it can't be partial
      arr[idx] = item as T
    }
  }
  return arr
}

Array.prototype.removeWhere = function removeWhere<T>(
  this: T[],
  match: (item: T) => boolean
): number {
  const idxs = this.map((item, index) => (match(item) ? index : -1))
    .filter((idx) => idx > -1)
    .sortOn("desc")
  for (const idx of idxs) {
    this.splice(idx, 1)
  }
  return idxs.length
}

Array.prototype.upsertWhere = function upsertWhere<T>(
  this: T[],
  item: T,
  where: (item: T) => boolean
): T[] {
  const arr = [...this]
  const idxs = arr
    .map((item, index) => (where(item) ? index : -1))
    .filter((idx) => idx > -1)
  for (const idx of idxs) {
    arr[idx] = item
  }
  if (idxs.length === 0) {
    arr.push(item)
  }
  return arr
}

Array.prototype.joinWith = function JoinWith<T>(
  this: T[],
  joiner: (item: T) => T | undefined
): T[] {
  if (this.length <= 1) return this
  const joined: T[] = []
  for (const item of this.slice(0, -1)) {
    joined.push(item)
    const join = joiner(item)
    if (join) {
      joined.push(join)
    }
  }
  joined.push(this.last())
  return joined
}

export {}
