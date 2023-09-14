import Store from 'electron-store';

const store = new Store();

export function get(key: string): any {
  return store.get(key);
}

export function set(key: string, value: any): any {
  return store.set(key, value);
}

export function remove(key: string) {
  return store.delete(key);
}
