import { HashTable } from "./hashtable"

describe("hash table", () => {
  let h: HashTable;
  const collidedKey1 = '19YN4';
  const collidedKey2 = 'hgLkU';

  const randomKey = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter++;
    }
    return result;
  }

  beforeEach(() => {
    h = new HashTable();
  });

  it("should exist", () => {
    expect(h).toBeTruthy;
  });

  it("should set a value", () => {
    expect(() => h.set('a', 1)).not.toThrow();
  });

  it("should get undefined if a value is not found", () => {
    expect(h.get('a')).toBe(undefined);
  });

  it("should get a value", () => {
    h.set('a', 1);
    h.set('b', 2);

    expect(h.get('a')).toBe(1);
    expect(h.get('b')).toBe(2);
  });

  it("should set a value if exists", () => {
    h.set('a', 1);
    expect(h.get('a')).toBe(1);
    h.set('a', 2);
    expect(h.get('a')).toBe(2);
    h.set('a', 3);
    expect(h.get('a')).toBe(3);
  });

  it("should handle collisions", () => {
    h.set(collidedKey1, 1);
    h.set(collidedKey2, 2);

    expect(h.get(collidedKey1)).toBe(1);
    expect(h.get(collidedKey2)).toBe(2);
    expect(h.collistions).toBe(1);
  });

  it("should have correct size", () => {
    h.set(collidedKey1, 1);
    h.set(collidedKey2, 2);

    expect(h.size).toBe(2);

    h.set(collidedKey2, 3);
    expect(h.size).toBe(2);
  });

  it("should handle many random keys", () => {
    const count = 10_000;
    const keys = Array.from({ length: count }, () => randomKey(10));
    const unique = new Set(keys).size;
    for (let i = 0; i < count; i++) {
      h.set(keys[i], i);
    }

    for (let i = 0; i < count; i++) {
      expect(h.get(keys[i])).toBe(i);
    }
    expect(h.size).toBe(unique);
    console.log('Collisions:', h.collistions);
    console.log('Avg buckets load:', h.getAvgEntries());

    // remove items
    keys.sort((a: string, b: string) => a.localeCompare(b));
    for (let i = 0; i < count; i++) {
      h.delete(keys[i]);
    }
    expect(h.size).toBe(0);

  });

  it("should remove keys", () => {
    h.set(collidedKey1, 1);
    h.set(collidedKey2, 2);

    h.delete(collidedKey2);
    expect(h.get(collidedKey2)).toBe(undefined);
    expect(h.size).toBe(1);
  });

  it("should work correctly after removal", () => {
    h.set(collidedKey1, 1);
    h.set(collidedKey2, 2);

    h.delete(collidedKey1);
    expect(h.get(collidedKey1)).toBe(undefined);
    expect(h.size).toBe(1);

    h.set(collidedKey2, 3)
    expect(h.get(collidedKey2)).toBe(3);
    expect(h.size).toBe(1);
  });

  it("should be iterable", () => {
    h.set('ab', 1);
    h.set('ba', 1);

    expect([...h]).toEqual([['ab', 1], ['ba', 1]]);
  });

  it("can be constructed from iterable", () => {
    const h = new HashTable<number>([
      ['ab', 1],
      ['ba', 2],
    ])

    expect(h.size).toEqual(2);
    expect([...h]).toEqual([['ab', 1], ['ba', 2]]);
  });

  it("can be constructed from another hash table", () => {
    h.set('ab', 1);

    const copy = new HashTable(h);

    expect(copy.get('ab')).toBe(1);
    expect(copy.size).toEqual(1);
  });

  it("should be clearable", () => {
    h.set('ab', 1);
    h.set('ba', 1);

    expect(h.size).toEqual(2);

    h.clear();
    expect(h.get('ab')).toBe(undefined);
    expect(h.size).toEqual(0);
  });

  it("should have 'has' method", () => {
    h.set('ab', 1);
    h.set('ba', 1);

    expect(h.has('ab')).toBe(true);
    expect(h.has('absdfsfsf')).toBe(false);
  });

  xit("find collided keys", () => {
    for (let i = 0; i < 100; i++) {
      const key1 = randomKey(5);
      const key2 = randomKey(5);
      if (h.hash(key1) === h.hash(key2)) {
        console.log(key1, key2);
      }
    }
    expect(true).toBe(true);
  });

});