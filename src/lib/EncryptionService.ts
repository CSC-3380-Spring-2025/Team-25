import * as crypto from 'crypto';

/**
 * A class to provide encryption and decryption
 * 
 * How to use:
 *   const service = new EncryptionService(<64-char hex key>);
 *   const encrypted = service.encrypt('Secret Message');
 *   const decrypted = service.decrypt(encrypted);
 */
export class EncryptionService {
  private secretKey: Buffer;
  private algorithm: string;

  /**
   * @param secretKey - A 32 byte character key for AES-256-CBC.
   * @param algorithm - The encryption algorithm (Im using AES)
   */
  constructor(secretKey: string, algorithm: string = 'aes-256-cbc') {
    // Convert thestring to a 32-byte buffer
    this.secretKey = Buffer.from(secretKey, 'hex');
    this.algorithm = algorithm;
  }

  /**
   * Encrypts plain text using the configured key and algorithm.
   * 
   * @param plainText - The string to encrypt.
   * @returns A string formatted as `iv:encryptedHex`.
   */
  public encrypt(plainText: string): string {
    // Generate a random IV for the encryption
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Combine IV and encrypted data for easier transport
    return `${iv.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypts an encrypted string that is formatted as `iv:encryptedHex`.
   * 
   * @param encryptedText - The string containing the IV and the encrypted text.
   * @returns The decrypted plaintext.
   */
  public decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
