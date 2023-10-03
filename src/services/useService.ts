import { IService } from './interfaces';
import { getElectronService } from './electronService';

export function useService(): IService {
  return getElectronService();
}
