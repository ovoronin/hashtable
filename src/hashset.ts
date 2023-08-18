import { HashTable } from "./hashtable";

export class HashSet extends HashTable<boolean> {
  constructor(from?: Iterable<string>) {
    super();
    if (from) {
      for (let element of from) {
        this.add(element);
      }
    }
  }

  add(key: string) {
    this.set(key, true);
  }

  *unroll(): IterableIterator<string> {
    for (let element of [...this]) {
      yield element[0];
    }
  }
}