import IUsersRepository from '@modules/users/repositories/IUserRepository';
import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute(): Promise<User[] | undefined> {
    const users = await this.usersRepository.find();
    return users;
  }
}

export default CreateUserService;
