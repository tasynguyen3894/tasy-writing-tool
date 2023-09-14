import { ref } from 'vue';
import { defineStore } from 'pinia';

import { ICharacterCreate, ICharacterRead, ICharacterUpdate } from 'src/models/Character';
import { ICharacterExtraCreate, ICharacterExtraRead } from 'src/models/CharacterExtra';
import { Routes } from 'src/models/Api';
import { useProjectStore } from './projectStore';

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<ICharacterRead[]>([]);
  const projectStore = useProjectStore();

  function init(): Promise<void> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.FetchCharacters, payload: {}, path: projectStore.projectPath})
          .then((result: ICharacterRead[]) => {
            characters.value = result;
            resolve();
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  function findCharacter(id: string): ICharacterRead | undefined {
    return characters.value.find(character => character.id === id);
  }

  function createCharacter(data: ICharacterCreate): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.CreateCharacter, payload: { data }, path: projectStore.projectPath})
          .then((result: ICharacterRead) => {
            characters.value.push(result);
            resolve(true);
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  function updateCharacter(id: string, data: ICharacterUpdate): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.UpdateCharacter, payload: { id, data }, path: projectStore.projectPath})
          .then((result: ICharacterRead) => {
            characters.value = characters.value.map(character => {
              if(character.id !== id) {
                return character;
              }
              return {
                ...result,
                metas: character.metas
              }
            })
            resolve(true);
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  function removeCharacter(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.RemoveCharacter, payload: { id }, path: projectStore.projectPath})
          .then((result: boolean) => {
            if(result) {
              characters.value = characters.value.filter(character => character.id !== id);
              resolve(result);
            } else {
              resolve(false);
            }
          });
      } else {
        return Promise.resolve();
      }
    });
  }

  function updateExtra(data: ICharacterExtraRead) {
    characters.value = characters.value.map(character => {
      if(character.id !== data.character_id) {
        return character;
      }
      const newCharacter = character;
      if(!newCharacter.metas) {
        newCharacter.metas = [data];
      } else {
        let existedExtra = false;
        newCharacter.metas = newCharacter.metas.map(meta => {
          if(meta.id !== data.id) {
            return meta
          }
          existedExtra = true;
          return data;
        });
        if(!existedExtra) {
          newCharacter.metas.push(data);
        }
      }
      return newCharacter;
    })
  }

  function removeExtra(characterId: string, id: string): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.RemoveCharacterExtra, payload: { id }, path: projectStore.projectPath})
          .then((result: boolean) => {
            characters.value = characters.value.map(character => {
              if(character.id !== characterId || !character.metas) {
                return character;
              }
              return {
                ...character,
                metas: character.metas.filter(meta => meta.id !== id)
              }
            });
            resolve(result);
          });
      } else {
        return Promise.resolve();
      }
    });
  }

  function createExtra(data: ICharacterExtraCreate): Promise<void> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.CreateCharacterExtra, payload: { data }, path: projectStore.projectPath})
          .then((result: ICharacterExtraRead | boolean) => {
            if(result instanceof Boolean) {
              resolve();
            } else {
              updateExtra(result as ICharacterExtraRead);
              resolve();
            }
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  function aliasIsExisted(alias: string, id = ''): boolean {
    return characters.value.some(character => {
      return character.alias === alias && (!id || character.id !== id)
    });
  }

  return {
    characters,
    init,
    findCharacter,
    createExtra,
    removeExtra,
    createCharacter,
    aliasIsExisted,
    removeCharacter,
    updateCharacter
  }
})
