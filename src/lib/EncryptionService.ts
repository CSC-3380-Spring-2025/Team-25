import * as crypto from 'crypto';
export class EncryptionService {
  private secretKey: Buffer;
  private algorithm: string;

  constructor(secretKey: string, algorithm: string = 'aes-256-cbc') {
    // Convert the string to a 32-byte buffer
    this.secretKey = Buffer.from(secretKey, 'hex');
    this.algorithm = algorithm;
  }
  public encrypt(plainText: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
  }
  public decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
