import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import FacilityList from '../components/facility/FacilityList';
import MapView from '../components/map/MapView';
import AuthModal from '../components/modals/AuthModal';
import DetailModal from '../components/modals/DetailModal';
import BookingModal from '../components/modals/BookingModal';
import SuccessModal from '../components/modals/SuccessModal';
import MyBookingsModal from '../components/modals/MyBookingsModal';
import { useGeolocation } from '../hooks/useGeolocation';
import { useFacilities } from '../hooks/useFacilities';
import { useReservations } from '../hooks/useReservations';
import { calculateDistance } from '../utils/distance';

const DEFAULT_FILTERS = {
  sport: 'all',
  searchQuery: '',
  radius: 5000,
  sortBy: 'distance',
  onlyAvailable: false,
};

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const { location, requestLocation, setLocation } = useGeolocation();
  const { facilities, updateFacilitySlots, refreshLocal } = useFacilities(location.lat, location.lng);
  const { saveReservation } = useReservations();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [successBooking, setSuccessBooking] = useState(null);

  const [authModal, setAuthModal] = useState({ open: false, tab: 'login' });
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);

  const filteredFacilities = useMemo(() => {
    let list = facilities.map((fac) => ({
      ...fac,
      distance: calculateDistance(location.lat, location.lng, fac.lat, fac.lng),
    }));

    if (filters.sport !== 'all') {
      list = list.filter((f) => f.sport === filters.sport);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (f) => f.name.toLowerCase().includes(q) || f.address.toLowerCase().includes(q)
      );
    }
    list = list.filter((f) => f.distance * 1000 <= filters.radius);
    if (filters.onlyAvailable) {
      list = list.filter((f) =>
        f.timeSlots[0].some((s) => s.state === 'available' || s.state === 'few')
      );
    }

    if (filters.sortBy === 'distance') list.sort((a, b) => a.distance - b.distance);
    else if (filters.sortBy === 'rating') list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (filters.sortBy === 'price') list.sort((a, b) => a.price - b.price);

    return list;
  }, [facilities, filters, location]);

  useEffect(() => {
    if (selectedFacility) {
      const updated = facilities.find((f) => f.id === selectedFacility.id);
      if (updated) setSelectedFacility(updated);
    }
  }, [facilities, selectedFacility?.id]);

  useEffect(() => {
    const search = searchParams.get('search');
    const facilityName = searchParams.get('facilityName');
    const action = searchParams.get('action');
    const sportParam = searchParams.get('sport');

    const sportMap = { 풋살: 'futsal', 테니스: 'tennis', 배드민턴: 'badminton', 농구: 'basketball' };

    if (search) {
      setFilters((prev) => ({ ...prev, searchQuery: decodeURIComponent(search) }));
    }
    if (sportParam && sportMap[sportParam]) {
      setFilters((prev) => ({ ...prev, sport: sportMap[sportParam] }));
    }
    if (action === 'login') setAuthModal({ open: true, tab: 'login' });
    else if (action === 'signup') setAuthModal({ open: true, tab: 'register' });

    if (facilityName && facilities.length > 0) {
      const decoded = decodeURIComponent(facilityName);
      const fac = facilities.find((f) => f.name.toLowerCase().includes(decoded.toLowerCase()));
      if (fac) {
        setTimeout(() => {
          setSelectedFacility(fac);
          setDetailOpen(true);
        }, 800);
      }
    }
  }, [searchParams, facilities]);

  const handleFilterChange = (updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectFacility = (fac) => {
    setSelectedFacility(fac);
    setDetailOpen(true);
  };

  const handleUpdateSlots = async (facilityId, timeSlots) => {
    await updateFacilitySlots(facilityId, timeSlots);
    refreshLocal();
    if (selectedFacility?.id === facilityId) {
      setSelectedFacility((prev) => ({ ...prev, timeSlots }));
    }
  };

  const handleRestoreSlot = async (booking) => {
    const fac = facilities.find((f) => f.id === booking.facilityId);
    if (!fac) return;
    const updatedSlots = fac.timeSlots.map((day, dIdx) =>
      dIdx === booking.dateOffset
        ? day.map((s, sIdx) =>
            sIdx === booking.slotIndex ? { ...s, state: 'available' } : s
          )
        : day
    );
    await handleUpdateSlots(booking.facilityId, updatedSlots);
  };

  const handleRequestLocation = () => {
    requestLocation();
    toast.success('GPS 현재 위치를 확인 중입니다.');
  };

  const handleLocationChange = (lat, lng) => {
    setLocation(lat, lng);
  };

  return (
    <div className="text-white select-none h-screen flex flex-col overflow-hidden">
      <Header
        onOpenAuth={(tab) => setAuthModal({ open: true, tab })}
        onOpenMyBookings={() => setMyBookingsOpen(true)}
      />

      <main className="flex-1 flex relative overflow-hidden">
        <FacilityList
          facilities={filteredFacilities}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSelectFacility={handleSelectFacility}
          onLocationChange={handleLocationChange}
          onRequestGps={handleRequestLocation}
        />
        <MapView
          userLocation={location}
          facilities={filteredFacilities}
          onSelectFacility={handleSelectFacility}
          onRequestLocation={handleRequestLocation}
        />
      </main>

      <AuthModal
        isOpen={authModal.open}
        initialTab={authModal.tab}
        onClose={() => setAuthModal({ open: false, tab: 'login' })}
      />

      <DetailModal
        facility={selectedFacility}
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedFacility(null);
        }}
        onProceedBooking={(info) => {
          setBookingInfo(info);
          setBookingOpen(true);
        }}
        onOpenAuth={(tab) => setAuthModal({ open: true, tab })}
        onUpdateSlots={handleUpdateSlots}
      />

      <BookingModal
        isOpen={bookingOpen}
        bookingInfo={bookingInfo}
        onClose={() => setBookingOpen(false)}
        onSuccess={(booking) => {
          setSuccessBooking(booking);
          setSuccessOpen(true);
        }}
        onSaveReservation={saveReservation}
        onUpdateSlots={handleUpdateSlots}
      />

      <SuccessModal
        isOpen={successOpen}
        booking={successBooking}
        onClose={() => {
          setSuccessOpen(false);
          setSuccessBooking(null);
          refreshLocal();
        }}
      />

      <MyBookingsModal
        isOpen={myBookingsOpen}
        onClose={() => setMyBookingsOpen(false)}
        onRestoreSlot={handleRestoreSlot}
      />
    </div>
  );
}
