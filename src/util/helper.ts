export function required(value: any): boolean | string {
  return value.length > 0 ? true : 'Required';
} 

export enum VariableAttribute {
  variable = 'data-variable',
  content = 'data-content'
}

export function detectProjectPath(projectPathToDetect: string): Promise<any> {
  return new Promise((resolve) => {
    window.Native.project({ type: 'detect', payload: { path: projectPathToDetect } })
      .then((res: any) => {
        resolve(res);
      });
  })
}

export function findItem<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}
