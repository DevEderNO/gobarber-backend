import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersServices from './ListProvidersServices';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersServices;
let fakeCacheProvider: FakeCacheProvider;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider= new FakeCacheProvider();
    listProviders = new ListProvidersServices(
      fakeUsersRepository,
      fakeCacheProvider
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
