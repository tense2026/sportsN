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
import { generateFacilitiesAround } from '../data/mockFacilities';

const STORAGE_KEY = 'sportsN_facilities';

export function useFacilities(userLat, userLng) {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const seedMockData = useCallback(async (lat, lng) => {
    const mockData = generateFacilitiesAround(lat, lng);
    if (isFirebaseEnabled) {
      const batch = writeBatch(db);
      mockData.forEach((fac) => {
        const docRef = doc(db, 'facilities', String(fac.id));
        batch.set(docRef, fac);
      });
      await batch.commit();
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
      setFacilities(mockData);
    }
  }, []);

  useEffect(() => {
    if (!userLat || !userLng) return;

    if (isFirebaseEnabled) {
      const init = async () => {
        const snapshot = await getDocs(collection(db, 'facilities'));
        if (snapshot.empty) {
          await seedMockData(userLat, userLng);
        }
      };
      init();

      const unsubscribe = onSnapshot(
        collection(db, 'facilities'),
        (snapshot) => {
          const data = snapshot.docs.map((d) => d.data()).sort((a, b) => a.id - b.id);
          setFacilities(data);
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
    if (cached) {
      setFacilities(JSON.parse(cached));
    } else {
      const mockData = generateFacilitiesAround(userLat, userLng);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
      setFacilities(mockData);
    }
    setLoading(false);
  }, [userLat, userLng, seedMockData]);

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
