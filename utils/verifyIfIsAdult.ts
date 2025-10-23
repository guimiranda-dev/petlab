export function verifyIfIsAdult(birthDate: Date, examDate?: Date) {
  const compareDate = examDate || new Date();
  const ageInMilliseconds = compareDate.getTime() - birthDate.getTime();
  const ageInDays = ageInMilliseconds / (1000 * 60 * 60 * 24);
  return ageInDays >= 90;
}
