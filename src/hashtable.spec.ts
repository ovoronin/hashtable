import { HashTable } from "./hashtable"

describe("hash table", () => {
  let hashtable: HashTable;

  beforeEach(() => {
    hashtable = new HashTable();
  });

  it("should exist", () => {
    expect(HashTable).toBeTruthy();
  });

  it("should have a constructor", () => {
    expect(hashtable instanceof HashTable).toBe(true);
  });

  it("should set a value", () => {
    expect(() => hashtable.set('a', 1)).not.toThrow();
  });

  it("should get undefined if a value is not found", () => {
    expect(hashtable.get('a')).toBe(undefined);
  });

  it("should get a value", () => {
    hashtable.set('a', 1);
    hashtable.set('b', 2);

    expect(hashtable.get('a')).toBe(1);
    expect(hashtable.get('b')).toBe(2);
  });

  it("should set a value if exists", () => {
    hashtable.set('a', 1);
    hashtable.set('a', 2);
    hashtable.set('a', 3);

    expect(hashtable.get('a')).toBe(3);
  });

  it("should handle collisions", () => {
    hashtable.set('ab', 1);
    hashtable.set('ba', 2);

    expect(hashtable.get('ab')).toBe(1);
    expect(hashtable.get('ba')).toBe(2);
  });

  it("should have correct size", () => {
    hashtable.set('ab', 1);
    hashtable.set('ba', 2);

    expect(hashtable.size).toBe(2);

    hashtable.set('ba', 3);
    expect(hashtable.size).toBe(2);
  });

  it("should handle many random keys", () => {
    const makeKey = (length: number): string => {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }

    const count = 10000;
    const keys = Array.from({ length: count }, () => makeKey(10));
    const unique = new Set(keys).size;
    for (let i = 0; i < count; i++) {
      hashtable.set(keys[i], i);
    }

    for (let i = 0; i < count; i++) {
      expect(hashtable.get(keys[i])).toBe(i);
    }
    expect(hashtable.size).toBe(unique);
    console.log(hashtable.collistions);

    // remove items
    keys.sort((a: string, b: string) => a.localeCompare(b));
    for (let i = 0; i < count; i++) {
      hashtable.delete(keys[i]);
    }
    expect(hashtable.size).toBe(0);

  });

  it("should remove keys", () => {
    hashtable.set('ab', 1);
    hashtable.set('ba', 1);

    expect(hashtable.get('ab')).toBe(1);

    hashtable.delete('ba');
    expect(hashtable.get('ba')).toBe(undefined);
    expect(hashtable.size).toBe(1);
  });

  it("should be iterable", () => {
    hashtable.set('ab', 1);
    hashtable.set('ba', 1);

    expect([...hashtable]).toEqual([['ab', 1], ['ba', 1]]);
  });

  it("can be constructed from iterable", () => {
    const h = new HashTable([
      ['ab', 1],
      ['ba', 2],
    ])

    expect(h.size).toEqual(2);
  });

  it("can be constructed from another hash table", () => {
    hashtable.set('ab', 1);

    const h = new HashTable(hashtable);

    expect(h.size).toEqual(1);
  });

  it("should be clearable", () => {
    hashtable.set('ab', 1);
    hashtable.set('ba', 1);

    expect(hashtable.size).toEqual(2);

    hashtable.clear();
    expect(hashtable.size).toEqual(0);
  });

  it("should have 'has' method", () => {
    hashtable.set('ab', 1);
    hashtable.set('ba', 1);

    expect(hashtable.has('ab')).toBe(true);
    expect(hashtable.has('absdfsfsf')).toBe(false);
  });
});