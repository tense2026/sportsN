export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function scheduleBookingReminder(booking) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  try {
    const parts = booking.dateTimeText.split(' ');
    const dateStr = parts[0];
    const startTimeStr = parts[1];
    const bookingTime = new Date(`${dateStr}T${startTimeStr}:00`);
    const reminderTime = new Date(bookingTime.getTime() - 60 * 60 * 1000);
    const delay = reminderTime.getTime() - Date.now();

    if (delay <= 0) return;

    setTimeout(() => {
      new Notification('스포츠N 예약 리마인더', {
        body: `${booking.facilityName} 이용 1시간 전입니다. (${booking.dateTimeText})`,
        icon: '/vite.svg',
        tag: booking.bookingId,
      });
    }, delay);
  } catch (err) {
    console.warn('Reminder scheduling failed:', err);
  }
}

export function showBookingConfirmedNotification(booking) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  new Notification('스포츠N 예약 완료', {
    body: `${booking.facilityName} 예약이 확정되었습니다. (${booking.bookingId})`,
    icon: '/vite.svg',
    tag: booking.bookingId,
  });
}
