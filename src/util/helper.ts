export function required(value: any): boolean | string {
  return value.length > 0 ? true : 'Required';
} 

export enum VariableAttribute {
  variable = 'data-variable',
  content = 'data-content'
}
