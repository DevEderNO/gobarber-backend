import { hash, compare } from 'bcryptjs';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

export default class BCryptHashProvider implements IHashProvider {
  generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }
  compareHash(payload: string, hash: string): Promise<boolean> {
    return compare(payload, hash);
  }
}
