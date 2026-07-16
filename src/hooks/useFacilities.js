import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  getDocs,
  writeBatch,
  updateDoc,
} from 'firebase/firestore';
import { db, isFirebaseEnabled } from '../config/firebase';
import { getGyeongsanDemoFacilities } from '../data/mockFacilities';

const STORAGE_KEY = 'sportsN_facilities';

function mergeWithDemoFacilities(existing = []) {
  const mockData = getGyeongsanDemoFacilities();
  const demoIds = new Set(mockData.map((fac) => fac.id));
  return [...mockData, ...existing.filter((fac) => !demoIds.has(fac.id))];
}

export function useFacilities(userLat, userLng) {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const upsertGyeongsanDemos = useCallback(async (existing = []) => {
    const mockData = getGyeongsanDemoFacilities();
    const merged = mergeWithDemoFacilities(existing);

    if (isFirebaseEnabled) {
      try {
        const batch = writeBatch(db);
        mockData.forEach((fac) => {
          batch.set(doc(db, 'facilities', String(fac.id)), fac);
        });
        await batch.commit();
      } catch (err) {
        console.error('Failed to upsert demo facilities:', err);
      }
      setFacilities(merged);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      setFacilities(merged);
    }
  }, []);

  useEffect(() => {
    if (!userLat || !userLng) return;

    if (isFirebaseEnabled) {
      const init = async () => {
        const snapshot = await getDocs(collection(db, 'facilities'));
        const existing = snapshot.docs.map((d) => d.data());
        await upsertGyeongsanDemos(existing);
      };
      init();

      const unsubscribe = onSnapshot(
        collection(db, 'facilities'),
        (snapshot) => {
          const data = snapshot.docs.map((d) => d.data());
          setFacilities(mergeWithDemoFacilities(data));
          setLoading(false);
        },
        (err) => {
          console.error('Firestore facilities error:', err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }

    const cached = localStorage.getItem(STORAGE_KEY);
    const existing = cached ? JSON.parse(cached) : [];
    upsertGyeongsanDemos(existing);
    setLoading(false);
  }, [userLat, userLng, upsertGyeongsanDemos]);

  const updateFacilitySlots = useCallback(async (facilityId, timeSlots) => {
    if (isFirebaseEnabled) {
      await updateDoc(doc(db, 'facilities', String(facilityId)), { timeSlots });
    } else {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const target = list.find((f) => f.id === facilityId);
      if (target) {
        target.timeSlots = timeSlots;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        setFacilities(list);
      }
    }
  }, []);

  const refreshLocal = useCallback(() => {
    if (!isFirebaseEnabled) {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) setFacilities(JSON.parse(cached));
    }
  }, []);

  return { facilities, loading, updateFacilitySlots, refreshLocal, isFirebaseEnabled };
}
