export default class Enums<T> {
  #arr: Array<T>;
  #index: number;
  constructor(arr: Array<T>) {
    this.#arr = arr;
    this.#index = 0;
  }
  get default() {
    return this.#arr[this.#index];
  }
  get next() {
    let index = this.#index + 1 >= this.#arr.length ? 0 : this.#index + 1;
    this.#index = index;
    return this.default;
  }
  at(i: number) {
    return this.#arr[i];
  }
  get currentIndex() {
    return this.#index;
  }
}
