import User from '@modules/users/infra/typeorm/entities/User';
import { getRepository, Not, Repository } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }
  public async find(): Promise<User[] | undefined> {
    const user = await this.ormRepository.find();
    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });
    return user;
  }

  public async save(user: User): Promise<User> {
    return await this.ormRepository.save(user);
  }

  public async create({ name, email, password }: ICreateUserDTO) {
    const user = this.ormRepository.create({ name, email, password });
    await this.ormRepository.save(user);
    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    const users = except_user_id
      ? this.ormRepository.find({
          where: {
            id: Not(except_user_id),
          },
        })
      : this.ormRepository.find();
    return users;
  }
}

export default UsersRepository;