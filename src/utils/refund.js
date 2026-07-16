export function calculateRefundAmount(booking) {
  try {
    const parts = booking.dateTimeText.split(' ');
    const dateStr = parts[0];
    const startTimeStr = parts[1];

    const bookingTime = new Date(`${dateStr}T${startTimeStr}:00`);
    const now = new Date();

    const diffMs = bookingTime - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours >= 24) {
      return { percent: 100, amount: booking.price, penalty: 0, hoursLeft: diffHours };
    }
    if (diffHours >= 12) {
      const amt = Math.floor(booking.price * 0.5);
      return { percent: 50, amount: amt, penalty: booking.price - amt, hoursLeft: diffHours };
    }
    return { percent: 0, amount: 0, penalty: booking.price, hoursLeft: diffHours };
  } catch (err) {
    console.error('Error calculating refund:', err);
    return { percent: 0, amount: 0, penalty: booking.price, hoursLeft: 0 };
  }
}
