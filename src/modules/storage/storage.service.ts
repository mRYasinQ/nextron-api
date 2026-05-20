import fs from 'node:fs/promises';
import path from 'node:path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import sharp from 'sharp';

import type { EnvConfig } from '@/shared/schemas/env.schema';
import { generateRandomBytes, md5 } from '@/shared/utils/random';

@Injectable()
class StorageService {
  private static instance: StorageService;

  private readonly uploadPath = 'public/uploads';
  private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    StorageService.instance = this;
  }

  public static getUrl(fileKey?: string | null) {
    return this.instance.getFileUrl(fileKey);
  }

  async uploadFile(file: Express.Multer.File, folder?: string) {
    let body = file.buffer;
    let contentType = file.mimetype;
    let ext = path.extname(file.originalname).toLowerCase();

    const isImage = contentType.startsWith('image/');
    const isSvg = contentType === 'image/svg+xml';

    if (isImage && !isSvg) {
      sharp.cache(false);
      body = await sharp(file.buffer).webp({ quality: 80, effort: 4 }).toBuffer();
      contentType = 'image/webp';
      ext = '.webp';
    }

    const hash = md5(generateRandomBytes(16, 'hex') + Date.now());
    const uniqueFileName = `${hash}${ext}`;
    const fileKey = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

    const targetDir = folder ? path.join(this.uploadDir, folder) : this.uploadDir;
    await fs.mkdir(targetDir, { recursive: true });
    const targetFilePath = path.join(this.uploadDir, fileKey);

    await fs.writeFile(targetFilePath, body);

    return fileKey;
  }

  uploadFiles(files: Express.Multer.File[], folder?: string) {
    return Promise.all(files.map((file) => this.uploadFile(file, folder)));
  }

  async deleteFile(fileKey: string) {
    const targetFilePath = path.join(this.uploadDir, fileKey);

    try {
      await fs.unlink(targetFilePath);
    } catch (error: unknown) {
      const err = error as NodeJS.ErrnoException;

      if (err.code !== 'ENOENT') throw error;
    }
  }

  getFileUrl(fileKey?: string | null) {
    if (!fileKey) return null;

    const baseUrl = this.config.getOrThrow<EnvConfig['APP_URL']>('app.url');

    return `${baseUrl}/${this.uploadPath}/${fileKey}`;
  }
}

export default StorageService;
