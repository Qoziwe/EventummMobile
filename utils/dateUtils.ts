/**
 * Вычисление возраста пользователя по дате рождения
 */
export function calculateUserAge(birthDate: string): number {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  
  if (isNaN(birthDateObj.getTime())) return 0;
  
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Валидация даты рождения
 */
export function validateBirthDate(birthDate: string): { valid: boolean; message?: string } {
  if (!birthDate) {
    return { valid: false, message: 'Дата рождения обязательна' };
  }
  
  const date = new Date(birthDate);
  
  if (isNaN(date.getTime())) {
    return { valid: false, message: 'Некорректный формат даты' };
  }
  
  const today = new Date();
  if (date > today) {
    return { valid: false, message: 'Дата рождения не может быть в будущем' };
  }
  
  const age = calculateUserAge(birthDate);
  if (age < 0 || age > 150) {
    return { valid: false, message: 'Некорректный возраст' };
  }
  
  return { valid: true };
}

/**
 * Валидация формата даты события
 */
export function validateEventDate(year: string, month: string, day: string): { valid: boolean; message?: string } {
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const dayNum = parseInt(day);
  
  if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
    return { valid: false, message: 'Некорректные значения даты' };
  }
  
  const date = new Date(yearNum, monthNum, dayNum);
  
  if (date.getFullYear() !== yearNum || date.getMonth() !== monthNum || date.getDate() !== dayNum) {
    return { valid: false, message: 'Некорректная дата' };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date < today) {
    return { valid: false, message: 'Дата события не может быть в прошлом' };
  }
  
  return { valid: true };
}
