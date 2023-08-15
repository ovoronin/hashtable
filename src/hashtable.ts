interface HashData<T> {
  key: string;
  value: T;
}

export class HashTable<T = any> {
  private max = 8;
  private data: Array<HashData<T>> = [];

  private hashFn(key: string, max: number): number {
    let hash = 0;
    for (let i = 0, len = key.length; i < len; i++) {
        let chr = key.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % max;
  }

  private getIndex(key: string): number {
    return this.hashFn(key, this.max);
  }

  public size = 0;
  public collistions = 0;

  constructor() {
    this.init();
  }

  private init() {
    this.size = 0;
    this.collistions = 0;
    this.data = new Array(this.max).fill(undefined);
  }

  private setAt(index: number, key: string, value: T) {
    if (!this.data[index % this.max]) {
      this.size++;
    }
    this.data[index % this.max] = { key, value };
  }

  private isNotKeyAt(index: number, key: string): boolean {
    return this.data[index % this.max] && this.data[index % this.max].key !== key;
  }

  set(key: string, value: T) {
    const index = this.getIndex(key);
    if (this.isNotKeyAt(index, key)) {
      // collision
      this.collistions++;

      if (this.size > this.max * 0.5) {
        this.grow();
        this.set(key, value);
        return;
      }

      for (let i = index + 1; i < index + this.max; i++) {
        // find a suitable entry in hashdata
        if (this.isNotKeyAt(i, key)) {
          continue;
        }
        this.setAt(i, key, value);
        return;
      }
      // not found
      throw "Panic";
    } else {
      this.setAt(index, key, value);
    }
  }

  grow() {
    const copy = [ ...this.data ];
    this.max *= 2;
    this.init();

    for (let item of copy) {
      if (item) {
        this.set(item.key, item.value);
      }
    }
  }

  get(key: string): T | undefined {
    const index = this.getIndex(key);
    if (!this.data[index]) {
      return undefined;
    }
    for (let i = index; i < index + this.max; i++) {
      const hashdata = this.data[i % this.max];
      if (hashdata?.key === key) {
        return hashdata.value;
      }
    }
    return undefined;
  }
}