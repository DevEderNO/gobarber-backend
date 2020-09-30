import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import FindUsersService from '@modules/users/services/FindUsersService';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return res.json(user);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const findUsers = container.resolve(FindUsersService);
    const users = await findUsers.execute();
    return res.json(users);
  }
}
