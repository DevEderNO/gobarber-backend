import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersServices from '@modules/appointments/services/ListProvidersServices';
import { classToClass } from 'class-transformer';

export default class ProvidersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const listProviders = container.resolve(ListProvidersServices);

    const providers = await listProviders.execute({
      user_id,
    });

    return res.json(classToClass(providers));
  }
}
