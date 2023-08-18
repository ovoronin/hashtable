import { HashSet } from "./hashset"

describe("hash set", () => {
  let h: HashSet;

  beforeEach(() => {
    h = new HashSet();
  });

  it("should exist", () => {
    expect(h).toBeTruthy;
  });

  it("should add elements", () => {
    expect(() => h.add('a')).not.toThrow();
  });

  it("should check elements", () => {
    h.add('a');
    expect(h.has('a')).toBe(true);
    expect(h.has('b')).toBe(false);
  });

  it("should have size", () => {
    h.add('a');
    h.add('b');
    expect(h.has('a')).toBe(true);
    expect(h.has('b')).toBe(true);
    expect(h.size).toBe(2);
  });

  it("should delete elements", () => {
    h.add('a');
    h.add('b');

    h.delete('a');
    expect(h.has('a')).toBe(false);
    expect(h.has('b')).toBe(true);
    expect(h.size).toBe(1);
  });

  it("should be iterable", () => {
    h.add('ab');
    h.add('ba');

    expect([...h.unroll()]).toEqual(['ab', 'ba']);
  });

  it("can be constructed from iterable", () => {
    const h = new HashSet(['ab', 'ba']);

    expect(h.size).toEqual(2);
    expect(h.has('ab')).toBe(true);
    expect(h.has('ba')).toBe(true);
  });

  it("can be constructed from another set", () => {
    h.add('ab');

    const copy = new HashSet(h.unroll());

    expect(copy.has('ab')).toBe(true);
    expect(copy.size).toEqual(1);
  });

});
