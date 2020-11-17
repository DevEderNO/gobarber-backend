import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider= new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      user_id: 'user',
      date: new Date(2020, 5, 10, 13),
      provider_id: 'provider',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 10).getTime();
    });

    await createAppointment.execute({
      user_id: 'user',
      date: appointmentDate,
      provider_id: '123456798',
    });

    await expect(
      createAppointment.execute({
        user_id: 'user',
        date: appointmentDate,
        provider_id: '123456789',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'user',
        provider_id: '123456789',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'user',
        provider_id: 'user',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 11, 7),
        user_id: 'user',
        provider_id: 'provider',
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 11, 18),
        user_id: 'user',
        provider_id: 'provider',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
