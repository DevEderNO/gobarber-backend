import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FindUsersService from '@modules/users/services/FindUsersService';

let fakeUsersRepository: FakeUsersRepository;
let findUsers: FindUsersService;

describe('FindUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    findUsers = new FindUsersService(fakeUsersRepository);
  });

  it('should be able to find users', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'email@email.com',
      password: '123456',
    });

    await fakeUsersRepository.create({
      name: 'John Doe1',
      email: 'email1@email.com',
      password: '123456',
    });

    const users = await findUsers.execute();

    expect(users).toHaveLength(2);
  });
});
