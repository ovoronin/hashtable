interface HashData<T> {
  key: string;
  value: T;
}

export class HashTable<T = any> {
  private max = 8;
  private data: Array<HashData<T>> = [];

  private hashFn(key: string, max: number): number {
    const sum = key.split('').reduce<number>((s, char) => s += char.charCodeAt(0), 0);
    return sum % max;
  }

  private getIndex(key: string): number {
    return this.hashFn(key, this.max);
  }

  constructor() {
    this.data = new Array(this.max).fill(undefined);
  }

  set(key: string, value: T) {
    const index = this.getIndex(key);
    if (this.data[index] && this.data[index].key !== key) {
      // collision
      for (let i = index + 1; i < index + this.max; i++) {
        // find an empty entry in hashdata
        if (this.data[i % this.max]) {
          continue;
        }
        this.data[i % this.max] = { key, value };
        return;
      }
      // not found
      throw "Panic";
    } else {
      this.data[index] = { key, value };
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
    throw "Panic";
  }
}