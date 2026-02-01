/**
 * Простой rate limiter для клиентской стороны
 * В production это должно быть на сервере!
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Проверка rate limit
 * @param key - уникальный ключ (например, userId + action)
 * @param maxRequests - максимальное количество запросов
 * @param windowMs - окно времени в миллисекундах
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 минута по умолчанию
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Создаем новую запись
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, newEntry);
    return { allowed: true, remaining: maxRequests - 1, resetTime: newEntry.resetTime };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  rateLimitStore.set(key, entry);
  return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
}

/**
 * Очистка старых записей
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Очистка каждые 5 минут
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}
