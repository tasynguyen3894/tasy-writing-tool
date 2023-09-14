

export function get(key: string): any {
  return window.Store.run({ type: 'get', payload: { key } })
}

export function set(key: string, value: any): any {
  return window.Store.run({ type: 'set', payload: { key, value } })
}

export function remove(key: string) {
  return window.Store.run({ type: 'remove', payload: { key } })
}
