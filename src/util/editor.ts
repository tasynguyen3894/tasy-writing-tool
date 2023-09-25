import { VariableAttribute } from 'src/util/helper';

export enum VariableType {
  character = 'character',
  object = 'object'
}

export interface VariableMeta {
  key: string,
  value: string
}

export interface Variable {
  id: string;
  name: string;
  metas: VariableMeta[];
}

export function findVariableValue(characters: Variable[], objects: Variable[], variable: string): string {
  const parts = variable.split('.');
  if(parts.length > 1) {
    if(parts[0] === 'character') {
      if(parts.length > 2) {
        if(parts[2] === 'name') {
          return findMetaValue(characters, parts[1], true);
        } else if (parts.length > 3) {
          return findMetaValue(characters, parts[1], false, parts[3]);
        }
      }
    } else {
      if(parts[0] === 'object') {
        if(parts.length > 2) {
          if(parts[2] === 'name') {
            return findMetaValue(objects, parts[1], true);
          } else if (parts.length > 3) {
            return findMetaValue(objects, parts[1], false, parts[3]);
          }
        }
      }
    }
  }
  return '';
}

function findMetaValue(variables: Variable[], id: string, name: boolean, meta?: string): string {
  const variable = variables.find(item => item.id === id);
  if(variable) {
    if(name) {
      return variable.name;
    } else if(meta) {
      return variable.metas.find(item => item.key == meta)?.value || '';
    }
  }
  return '';
}
