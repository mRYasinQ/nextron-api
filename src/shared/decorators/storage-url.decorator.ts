import { Transform } from 'class-transformer';

import StorageService from '@/modules/storage/storage.service';

type TransformOptions = { value: string | null };

const ToStorageUrl = () => {
  return Transform(({ value }: TransformOptions) => StorageService.getUrl(value));
};

export default ToStorageUrl;
