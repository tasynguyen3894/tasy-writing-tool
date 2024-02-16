import { get } from 'src/util/storage';
import { PROJECT_PATH_KEY } from 'src/util/constant';
import { detectProjectPath } from 'src/util/helper';
import { useProjectStore } from 'src/stores/projectStore';

export function useCheckCurrentProject() {
  const projectStore = useProjectStore();

  return {
    check(): Promise<void> {
      return new Promise((resolve, reject) => {
        get(PROJECT_PATH_KEY)
        .then((projectPathInStore: any) => {
          if(projectPathInStore) {
            detectProjectPath(projectPathInStore).then((res: any) => {
              if(res) {
                projectStore.getDataProject(projectPathInStore).then(() => {
                  resolve();
                })
                .catch((error) => reject(error))
              } else {
                reject()
              }
            })
            .catch((error) => reject(error))
          }
        })
        .catch((error) => reject(error))
      })
    }
  }
}
