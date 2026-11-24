import api from '../services/api';

// Public URL the QR code points to. Scanning it downloads the receipt PDF straight away.
// Needs a backend address the member's phone can reach (your hosted backend URL, not localhost).
export const receiptUrl = (token) => `${String(api.defaults.baseURL).replace(/\/$/, '')}/receipts/${token}`;

export default receiptUrl;
