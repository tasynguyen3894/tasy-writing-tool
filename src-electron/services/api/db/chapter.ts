import { Knex } from 'knex';
import fs from 'fs';
import path from 'path';

import { modelFactory, ModelName } from 'src-electron/services/models';
import { IChapterRead, IChapterReadItem } from 'src/models/Chapter';
import { ICharacterRead } from 'src/models/Character';
import { IObjectRead } from 'src/models/Object';
import { findVariableValue } from 'src/util/editor';
import { fetchCharacter } from './character';
import { fetchObject } from './object';
import { ConfigKey } from 'src/models/Config';
import { getConfig } from './config';

export function getChapter(connection: Knex, id: string): Promise<IChapterReadItem | undefined> {
  const ChapterModel = modelFactory(connection).getModel(ModelName.Chapter);

  if(!ChapterModel) {
    return Promise.resolve(undefined);
  }
  
  return new Promise((resolve, reject) => {
    ChapterModel.where({ id }).fetch({ require: false }).then((chapter: any) => {
      if(chapter) {
        resolve({
          id: chapter.get('id'),
          title: chapter.get('title'),
          description: chapter.get('description'),
          content: chapter.get('content'),
          tags: chapter.get('tags').split(','),
          status: chapter.get('status')
        });
      } else {
        resolve(undefined)
      }
    }).catch((error: Error) => {
      reject(error)
    })
  });
}

export type ExportPrepareData = {
  characters: ICharacterRead[],
  objects: IObjectRead[],
  config: { [key: string]: string }
}

export function prepareForExport(connection: Knex): Promise<ExportPrepareData> {
  return new Promise((resolve, reject) => {
    Promise.allSettled([
      fetchCharacter(connection),
      fetchObject(connection),
      getConfig(connection, ConfigKey.author)
    ]).then(([promiseCharacterResult, promiseObjectResult, promiseConfigResult]) => {
      const exportParameter: ExportPrepareData = {
        characters: [],
        objects: [],
        config: {
          author: ''
        }
      };

      if(promiseCharacterResult.status === 'fulfilled') {
        exportParameter.characters = promiseCharacterResult.value;
      }
      if(promiseObjectResult.status === 'fulfilled') {
        exportParameter.objects = promiseObjectResult.value;
      }
      if(promiseConfigResult.status === 'fulfilled' && promiseConfigResult.value) {
        exportParameter.config.author = promiseConfigResult.value.value;
      }
      resolve(exportParameter);
    }).catch(error => {
      reject(error);
    })
  })
}

export function exportChapterContent(data: ExportPrepareData & {
  chapter: IChapterRead
}): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const { characters, objects, chapter  } = data;
      const jsdom = require('jsdom');
      const { JSDOM } = jsdom;
      const dom = new JSDOM(`<!DOCTYPE html>` + chapter.content)
      dom.window.document.querySelectorAll(`[data-variable]`).forEach((node: Element) => {
        const variable = node.getAttribute('data-variable');
        if(variable) {
          node.textContent = findVariableValue(characters, objects, variable);
        }
      });
      const lines: string[] = [];
      const firstLine: string[] = [];

      dom.window.document.body.childNodes.forEach((node: Element) => {
        if(node.tagName === 'DIV') {
          lines.push(node.innerHTML)
        } else {
          if(node.nodeType === 3 && node.nodeValue) {
            firstLine.push(node.nodeValue);
          } else {
            firstLine.push(node.outerHTML);
          }
        }
      });
      resolve([firstLine.join(''), ...lines].map(line => {
        return '<p>' + line + '</p>';
      }).join(''));
    } catch (error) {
      reject(error);
    }
  })
}

export function createFileWord(data: {
  content: string,
  title: string,
  description?: string,
  tags?: string[],
  author: string
}): Promise<any> {
  return new Promise((resolve, reject) => {
    const { content, title, description = '', tags = [], author } = data;
    const HTMLtoDOCX = require('html-to-docx');
    const docxContent = `<!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>Document</title>
        </head>
        <body>
          ${content}
        </body>
      </html>`
    HTMLtoDOCX(docxContent, null, {
      table: {
        row: {
          cantSplit: true
        }
      },
      title: title,
      description: description,
      keywords: tags,
      creator: author,
      footer: true,
      pageNumber: true,
    })
    .then((fileBuffer: any) => {
      resolve(fileBuffer);
    })
    .catch((error: Error) => reject(error));
  })
}

export function exportChapter(
  connection: Knex,
  data: {
    id: string,
    pathExport: string
  } & ExportPrepareData
): Promise<void> {
  return new Promise((resolve, reject) => {
    const { config, id, pathExport, characters, objects  } = data;
    const author = config ? config.value : '';
    getChapter(connection, id).then(chapter => {
      if(chapter) {
        exportChapterContent({
          characters,
          objects,
          config,
          chapter
        }).then(content => {
          createFileWord({
            content,
            title: chapter.title,
            description: chapter.description,
            author,
            tags: chapter.tags
          }).then((fileBuffer: any) => {
            fs.writeFile(path.resolve(pathExport), fileBuffer, (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          });
        })
        .catch(error => reject(error));
      } else {
        reject('Not found chapter');
      }
    })
  });
}
