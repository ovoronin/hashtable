import { HashTable } from "./hashtable"

describe("hash table", () => {
  it("should exist", () => {
    expect(HashTable).toBeTruthy();
  });

  it("should have a constructor", () => {
    const hashtable = new HashTable();
    expect(hashtable instanceof HashTable).toBe(true);
  });

});