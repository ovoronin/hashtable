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

});