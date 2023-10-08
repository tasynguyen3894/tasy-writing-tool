import { describe, it, expect } from 'vitest';

import { findItem } from '../helper';

type FindItemTestSuit<T extends { id: string }> = {
  description: string,
  items: T[],
  id: string,
  result: T | undefined
}

const findItemDataProvider: FindItemTestSuit<{ id: string }>[] = [
  {
    description: 'Should return right item',
    items: [
      { id: '1' }, { id: '2' }
    ],
    id: '1',
    result: { id: '1'}
  },
  {
    description: 'Should return undefined for case dont have any match item',
    items: [
      { id: '1' }, { id: '2' }
    ],
    id: '3',
    result: undefined
  },
  {
    description: 'Should return undefined if the array is empty',
    items: [],
    id: '3',
    result: undefined
  }
]

describe.each(findItemDataProvider)('Test findITem', ({ description, items, id, result }) => {
  it(description, () => {
    expect(findItem(items, id)).toEqual(result);
  })
});
