import { ref } from 'vue';
import { defineStore } from 'pinia';

import { ICharacterCreate, ICharacterRead, ICharacterUpdate } from 'src/models/Character';
import { ICharacterExtraCreate, ICharacterExtraRead } from 'src/models/CharacterExtra';
import { Routes } from 'src/models/Api';
import { useProjectStore } from './projectStore';
import { useService } from 'src/services/useService';

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<ICharacterRead[]>([]);
  const projectStore = useProjectStore();
  const characterService = useService().getCharacterService();

  function init(): Promise<void> {
    if(projectStore.projectPath) {
      const projectId = projectStore.projectPath;
      return new Promise((resolve) => {
        characterService.getCharacters(projectId)
          .then((result: ICharacterRead[]) => {
            characters.value = result;
            resolve();
          })
      });
    } else {
      return Promise.resolve();
    }
  }

  function findCharacter(id: string): ICharacterRead | undefined {
    return characters.value.find(character => character.id === id);
  }

  function createCharacter(data: ICharacterCreate): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        characterService.createCharacter(projectStore.projectPath, data)
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
        characterService.updateCharacter(projectStore.projectPath, id, data)
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
        characterService.removeCharacter(projectStore.projectPath, id)
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
        characterService.removeCharacterExtra(projectStore.projectPath, id)
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
        characterService.createCharacterExtra(projectStore.projectPath, data)
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
