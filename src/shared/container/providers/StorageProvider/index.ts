import { container } from 'tsyringe';

import IStorageProvider from './models/IStorageProvider';
import DiskStorageProvider from './fakes/FakeStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';
import upload from '@config/upload';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[upload.driver]
);
