interface Bucket<T> {
  key: string;
  value: T;
}

export class HashTable<T = any> implements Iterable<[string, T]> {
  static readonly initialNBuckets = 8;
  static hashFn = (key: string): number => {
    let hash = 0;
    for (let i = 0, len = key.length; i < len; i++) {
      let chr = key.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private nBuckets = HashTable.initialNBuckets;
  private buckets: Array<Bucket<T> | undefined> = [];

  public hash(key: string): number {
    return HashTable.hashFn(key) % this.nBuckets;
  }

  public size = 0;
  public collistions = 0;

  constructor(from?: Iterable<[string, T]>) {
    this.init();

    if (from) {
      for (let item of from) {
        if (item) {
          this.set(item[0], item[1]);
        }
      }
    }
  }

  private init() {
    this.size = 0;
    this.collistions = 0;
    this.buckets = new Array(this.nBuckets).fill(undefined);
  }

  public clear() {
    this.nBuckets = HashTable.initialNBuckets;
    this.init();
  }

  private setAt(hash: number, key: string, value: T) {
    const h = hash % this.nBuckets;
    if (!this.buckets[h]) {
      this.size++;
    }
    this.buckets[h] = { key, value };
  }

  private findHash(key: string): number | -1 {
    const hash = this.hash(key);
    for (let h = hash; h < hash + this.nBuckets; h++) {
      const bucket = this.buckets[h % this.nBuckets];
      if (bucket?.key === key) {
        return h % this.nBuckets;
      }
    }
    return -1;
  }

  private collision(hash: number, key: string): boolean {
    const h = hash % this.nBuckets;
    return !!this.buckets[h] && this.buckets[h]?.key !== key;
  }

  set(key: string, value: T) {
    const hash = this.hash(key);
    if (this.collision(hash, key)) {
      this.collistions++;

      const loadFactor = this.size / this.nBuckets;
      if (loadFactor > 0.6) {
        this.grow();
        this.set(key, value);
        return;
      }

      for (let h = hash + 1; h < hash + this.nBuckets; h++) {
        // find a suitable bucket
        if (!this.collision(h, key)) {
          this.setAt(h, key, value);
          return;
        }
      }
      // not found
      throw "Panic";
    } else {
      this.setAt(hash, key, value);
    }
  }

  grow() {
    const copy = [...this.buckets];
    this.nBuckets *= 2;
    this.init();

    for (let bucket of copy) {
      if (bucket) {
        this.set(bucket.key, bucket.value);
      }
    }
  }

  get(key: string): T | undefined {
    const hash = this.findHash(key);
    if (hash === -1) {
      return undefined;
    }
    return this.buckets[hash]?.value;
  }

  has(key: string): boolean {
    return this.findHash(key) !== -1;
  }

  delete(key: string) {
    const hash = this.findHash(key);
    if (hash === -1) {
      return;
    }
    this.buckets[hash] = undefined;
    this.size--;
  }

  [Symbol.iterator](): Iterator<[string, T]> {
    let hash = 0;
    const buckets = this.buckets.filter(bucket => !!bucket);

    return {
      next: () => {
        if (hash < buckets.length) {
          const bucket = buckets[hash++];
          return { value: [bucket!.key, bucket!.value], done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }
}
