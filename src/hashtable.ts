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
  protected buckets: Array<Array<Bucket<T>>> = [];

  public hash(key: string): number {
    return HashTable.hashFn(key) % this.nBuckets;
  }

  public size = 0;
  public collistions = 0;

  constructor(from?: Iterable<[string, T]>) {
    this.init();

    if (from) {
      for (let item of from) {
        this.set(item[0], item[1]);
      }
    }
  }

  private init() {
    this.size = 0;
    this.collistions = 0;
    this.buckets = new Array(this.nBuckets).fill(null).map(x => []);
  }

  public clear() {
    this.nBuckets = HashTable.initialNBuckets;
    this.init();
  }

  findBucket(hash: number, key: string): Bucket<T> | undefined {
    return this.buckets[hash].find(b => b.key === key);
  }

  set(key: string, value: T) {
    const hash = this.hash(key);
    const bucket = this.findBucket(hash, key);

    if (!bucket) {
      this.buckets[hash].push({ key, value });
      if (this.buckets[hash].length > 1) {
        this.collistions++;
      }
      this.size++;
    } else {
      bucket.value = value;
    }

    const loadFactor = this.size / this.nBuckets;
    if (loadFactor > 0.6) {
      this.grow();
    }
  }

  grow() {
    const copy = [...this];
    this.nBuckets *= 2;
    this.init();

    for (let bucket of copy) {
      this.set(bucket[0], bucket[1]);
    }
  }

  get(key: string): T | undefined {
    return this.findBucket(this.hash(key), key)?.value;
  }

  has(key: string): boolean {
    return !!this.findBucket(this.hash(key), key);
  }

  delete(key: string) {
    const hash = this.hash(key);
    this.buckets[hash] = this.buckets[hash].filter(b => {
      const toDelete = b.key === key;
      if (toDelete) {
        this.size--;
      }
      return !toDelete;
    });
  }

  *[Symbol.iterator](): IterableIterator<[string, T]> {
    for (let buckets of this.buckets) {
      for (let bucket of buckets) {
        yield [ bucket.key, bucket.value ];
      }
    }
  }
}
