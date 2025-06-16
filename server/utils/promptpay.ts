// server/utils/promptpay.ts

import qr from 'promptpay-qr';

/**
 * สร้าง QR Code สำหรับ PromptPay
 * @param mobileNumber - เบอร์โทรศัพท์หรือเลขประจำตัวผู้เสียภาษีที่ผูกกับ PromptPay
 * @param amount - จำนวนเงิน (สามารถมีทศนิยมได้)
 * @returns {string} - Payload ของ QR Code
 */
export function generatePromptPayQrCode(mobileNumber: string, amount: number): string {
  // *** จุดที่แก้ไข ***
  // เรียกใช้ qr() โดยตรง ไม่ต้องมี .generate
  const payload = qr(mobileNumber, { amount }); 
  return payload;
}