export class HashTable<T = any> {
  private max = 8;
  private data: Array<T> = [];

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
    this.data[index] = value;
  }

  get(key: string): T | undefined {
    const index = this.getIndex(key);
    return this.data[index];
  }
}