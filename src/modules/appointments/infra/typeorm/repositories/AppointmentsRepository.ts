import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { getRepository, Raw, Repository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IApointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAllMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });
    return findAppointment;
  }

  public async create({ user_id, provider_id, date }: ICreateAppointmentDTO) {
    const appointment = this.ormRepository.create({
      user_id,
      provider_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFiledName =>
            `to_char(${dateFiledName},'MM-YYYY') = '${parsedMonth}-${year}'`
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayProvider({
    provider_id,
    month,
    year,
    day,
  }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFiledName =>
            `to_char(${dateFiledName},'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        ),
      },
      relations: ['user'],
    });

    return appointments;
  }
}

export default AppointmentsRepository;
