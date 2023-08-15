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

  public size = 0;

  constructor() {
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