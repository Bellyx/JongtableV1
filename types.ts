export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}
export interface SessionData {
  user?: {
    id: number;
    email: string;
    role: 'user' | 'admin';
  }
}
export interface LoginApiResponse {
  success: boolean;
  user: User;
}
export interface MeApiResponse {
  user: User | null;
}

export interface Booking {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  booking_date: string | null;
  guests: number | null;
  booking_ref: string; // ควรรักษาไว้เป็น non-null เพราะเป็นค่าสำคัญ
  deposit_amount: number | null;
  payment_amount: number | null;
  status: 'PENDING_PAYMENT' | 'PENDING_VERIFICATION' | 'CONFIRMED' | 'CANCELLED' | null;
  slip_url: string | null;
  created_at: string | null;
}

export interface BookingsResponse {
  bookings: Booking[];
  total: number;
}

interface EventFormState {
  name: string
  description: string
  event_date: string
  location: string
  status: 'UPCOMING' | 'ONGOING' | 'ENDED'
  display_start_time: string
  display_end_time: string
}

const state = ref<EventFormState>({
  name: '',
  description: '',
  event_date: '',
  location: '',
  status: 'UPCOMING',
  display_start_time: '',
  display_end_time: ''
})