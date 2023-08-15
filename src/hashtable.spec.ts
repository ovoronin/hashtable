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
});