interface Bucket<T> {
  key: string;
  value: T;
}

const initialMaxBuckets = 8;

export class HashTable<T = any> implements Iterable<[string, T]> {
  private maxBuckets = initialMaxBuckets;
  private buckets: Array<Bucket<T> | undefined> = [];

  private hash(key: string): number {
    let hash = 0;
    for (let i = 0, len = key.length; i < len; i++) {
        let chr = key.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % this.maxBuckets;
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
    this.buckets = new Array(this.maxBuckets).fill(undefined);
  }

  public clear() {
    this.maxBuckets = initialMaxBuckets;
    this.init();
  }

  private setAt(index: number, key: string, value: T) {
    if (!this.buckets[index % this.maxBuckets]) {
      this.size++;
    }
    this.buckets[index % this.maxBuckets] = { key, value };
  }

  private collision(index: number, key: string): boolean {
    const i = index % this.maxBuckets;
    return !!this.buckets[i] && this.buckets[i]?.key !== key;
  }

  set(key: string, value: T) {
    const index = this.hash(key);
    if (this.collision(index, key)) {
      this.collistions++;

      if (this.size > this.maxBuckets * 0.5) {
        this.grow();
        this.set(key, value);
        return;
      }

      for (let i = index + 1; i < index + this.maxBuckets; i++) {
        // find a suitable bucket
        if (!this.collision(i, key)) {
          this.setAt(i, key, value);
          return;
        }
      }
      // not found
      throw "Panic";
    } else {
      this.setAt(index, key, value);
    }
  }

  grow() {
    const copy = [ ...this.buckets ];
    this.maxBuckets *= 2;
    this.init();

    for (let bucket of copy) {
      if (bucket) {
        this.set(bucket.key, bucket.value);
      }
    }
  }

  private findIndex(key: string): number | -1 {
    const index = this.hash(key);
    for (let i = index; i < index + this.maxBuckets; i++) {
      const bucket = this.buckets[i % this.maxBuckets];
      if (bucket?.key === key) {
        return i;
      }
    }
    return -1;
  }

  has(key: string): boolean {
    return this.findIndex(key) !== -1;
  }

  get(key: string): T | undefined {
    const index = this.findIndex(key);
    if (index === -1) {
      return undefined;
    }
    return this.buckets[index]?.value;
  }

  delete(key: string) {
    const index = this.findIndex(key);
    if (index === -1) {
      return;
    }
    this.buckets[index] = undefined;
    this.size--;
  }

  [Symbol.iterator](): Iterator<[string, T]> {
    let index = 0;
    const buckets = this.buckets.filter(item => !!item);

    return {
      next: () => {
        if (index < buckets.length) {
          const bucket = buckets[index++];
          return { value: [bucket!.key, bucket!.value], done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }
}
