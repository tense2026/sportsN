import { useCallback } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, isFirebaseEnabled } from '../config/firebase';

const STORAGE_KEY = 'sportsN_reservations';

export function useReservations() {
  const saveReservation = useCallback(async (booking) => {
    if (isFirebaseEnabled) {
      await setDoc(doc(db, 'reservations', booking.bookingId), booking);
    } else {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      list.push(booking);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  }, []);

  const getUserReservations = useCallback(async (userEmail) => {
    if (isFirebaseEnabled) {
      const q = query(collection(db, 'reservations'), where('userEmail', '==', userEmail));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => d.data());
    }
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return list.filter((r) => r.userEmail === userEmail);
  }, []);

  const getReservation = useCallback(async (bookingId) => {
    if (isFirebaseEnabled) {
      const snap = await getDoc(doc(db, 'reservations', bookingId));
      return snap.exists() ? snap.data() : null;
    }
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return list.find((r) => r.bookingId === bookingId) || null;
  }, []);

  const cancelReservation = useCallback(async (bookingId) => {
    if (isFirebaseEnabled) {
      await deleteDoc(doc(db, 'reservations', bookingId));
    } else {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const filtered = list.filter((r) => r.bookingId !== bookingId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  }, []);

  return { saveReservation, getUserReservations, getReservation, cancelReservation };
}
