import * as Crypto from 'expo-crypto';

/**
 * Хеширование пароля (используем SHA-256 для простоты в мобильном приложении)
 * В production это должно быть на сервере с bcrypt!
 */
export async function hashPassword(password: string): Promise<string> {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

/**
 * Проверка пароля
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
  return passwordHash === hash;
}

/**
 * Генерация безопасного ID
 */
export function generateSecureId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 11);
  const extraRandom = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}_${randomPart}_${extraRandom}` : `${timestamp}_${randomPart}_${extraRandom}`;
}

/**
 * Валидация email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Валидация пароля
 * Минимум 8 символов, хотя бы одна буква и одна цифра
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Пароль должен содержать минимум 8 символов' };
  }
  if (!/[a-zA-Zа-яА-Я]/.test(password)) {
    return { valid: false, message: 'Пароль должен содержать хотя бы одну букву' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Пароль должен содержать хотя бы одну цифру' };
  }
  return { valid: true };
}

/**
 * Санитизация текста (удаление потенциально опасных символов)
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Валидация URL изображения
 */
export function validateImageUrl(url: string): boolean {
  if (!url || url.trim().length === 0) return false;
  
  try {
    const parsedUrl = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return false;
    }
    
    // Блокируем опасные протоколы
    const dangerousProtocols = ['javascript:', 'data:', 'file:', 'vbscript:'];
    if (dangerousProtocols.some(proto => url.toLowerCase().includes(proto))) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Валидация формата телефона (казахстанский формат)
 */
export function validatePhone(phone: string): boolean {
  // Удаляем все нецифровые символы
  const cleaned = phone.replace(/\D/g, '');
  
  // Проверяем форматы: +7XXXXXXXXXX, 7XXXXXXXXXX, 8XXXXXXXXXX
  const patterns = [
    /^\+7\d{10}$/,  // +7XXXXXXXXXX
    /^7\d{10}$/,    // 7XXXXXXXXXX
    /^8\d{10}$/,    // 8XXXXXXXXXX
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Форматирование телефона для отображения
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'))) {
    return `+7 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9)}`;
  }
  
  return phone;
}
