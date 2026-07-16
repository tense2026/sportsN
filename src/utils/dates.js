export function getDateString(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}월 ${dd}일`;
}

export function getFormattedFullDate(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getDateLabel(offset) {
  return ['오늘', '내일', '모레'][offset] || '';
}
