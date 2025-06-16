// // server/api/bookings/upload-slip.post.ts
// import { db } from '~/server/utils/db';
// import { writeFile, mkdir } from 'node:fs/promises'; // เพิ่ม mkdir
// import { join } from 'node:path';
// import type { FieldPacket } from 'mysql2';

// // Helper function สำหรับแปลงวันที่
// function toMySQLDateTime(date: Date): string {
//   return date.toISOString().slice(0, 19).replace('T', ' ');
// }

// export default defineEventHandler(async (event) => {
//   try {
//     const formData = await readMultipartFormData(event);
    
//     const bookingRefEntry = formData?.find(item => item.name === 'booking_ref');
//     const payerNameEntry = formData?.find(item => item.name === 'payer_name');
//     const paymentTimeEntry = formData?.find(item => item.name === 'payment_timestamp');
//     const slipFileEntry = formData?.find(item => item.name === 'slip_file');

//     const booking_ref = bookingRefEntry?.data.toString();

//     if (!booking_ref || !paymentTimeEntry?.data || !slipFileEntry || !slipFileEntry.filename || !slipFileEntry.data) {
//         throw createError({ statusCode: 400, statusMessage: 'ข้อมูลไม่ครบถ้วน กรุณากรอกข้อมูลและแนบไฟล์สลิป' });
//     }

//     // *** จุดที่แก้ไข 1: แปลงและตรวจสอบวันที่ ***
//     const paymentTimestamp = new Date(paymentTimeEntry.data.toString());
//     if (isNaN(paymentTimestamp.getTime())) {
//         throw createError({ statusCode: 400, statusMessage: 'รูปแบบวันที่และเวลาที่โอนไม่ถูกต้อง' });
//     }

//     // ตรวจสอบว่ามี booking ref นี้ในระบบจริงหรือไม่
//     const [rows]: [any[], FieldPacket[]] = await db.query("SELECT id FROM bookings WHERE booking_ref = ? AND status = 'PENDING_PAYMENT'", [booking_ref]);
//     if (rows.length === 0) {
//         throw createError({ statusCode: 404, statusMessage: 'ไม่พบเลขที่การจองนี้ หรือการจองถูกดำเนินการไปแล้ว' });
//     }

//     // สร้างชื่อไฟล์ใหม่เพื่อป้องกันชื่อซ้ำ
//     const fileExtension = slipFileEntry.filename.split('.').pop() || 'jpg';
//     const newFilename = `${booking_ref}-${Date.now()}.${fileExtension}`;
    
//     // *** จุดที่แก้ไข 2: สร้างโฟลเดอร์อัตโนมัติ ***
//     const uploadsDir = join(process.cwd(), 'public', 'uploads', 'slips');
//     await mkdir(uploadsDir, { recursive: true }); // recursive: true จะไม่ error ถ้าโฟลเดอร์มีอยู่แล้ว

//     const filePath = join(uploadsDir, newFilename);
//     const fileUrl = `/uploads/slips/${newFilename}`;
    
//     // บันทึกไฟล์ลง server
//     await writeFile(filePath, slipFileEntry.data);

//     // อัปเดตฐานข้อมูล
//     const sql = `
//       UPDATE bookings 
//       SET 
//         slip_url = ?, 
//         payer_name = ?, 
//         payment_timestamp = ?,
//         status = 'PENDING_VERIFICATION'
//       WHERE booking_ref = ?
//     `;

//     // *** จุดที่แก้ไข 3: ใช้ค่าวันที่ที่แปลงแล้ว ***
//     await db.query(sql, [
//         fileUrl,
//         payerNameEntry?.data.toString(),
//         toMySQLDateTime(paymentTimestamp), // ใช้ค่าที่แปลงแล้ว
//         booking_ref
//     ]);

//     return { success: true, message: 'อัปโหลดสลิปสำเร็จแล้ว รอการตรวจสอบ' };

//   } catch (error: any) {
//     console.error('Slip Upload Error:', error);
//     const statusMessage = error.data?.statusMessage || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์';
//     throw createError({ statusCode: error.statusCode || 500, statusMessage: statusMessage });
//   }
// });

// server/api/bookings/upload-slip.post.ts
import pool from '~/server/utils/db';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { FieldPacket, RowDataPacket } from 'mysql2';

// ดึง Config ที่มี API Key
const config = useRuntimeConfig();

function toMySQLDateTime(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * ฟังก์ชันสำหรับส่งสลิปไปตรวจสอบกับ OCR.space ในโหมดภาษาอังกฤษ
 * @param filePath Path ของไฟล์รูปภาพสลิป
 * @returns Object ที่มีรายการตัวเลขทั้งหมดที่ลงท้ายด้วยทศนิยม .XX ที่หาเจอ
 */
async function verifySlipWithOCR_English(filePath: string): Promise<{ detectedAmounts: number[] }> {
  const ocrApiUrl = 'https://api.ocr.space/parse/image';
  
  try {
    const formData = new FormData();
    formData.append('apikey', config.ocrSpaceApiKey);
    formData.append('language', 'eng'); // ใช้ 'eng' เพื่ออ่านตัวเลข
    // ไม่ต้องใช้ ocrengine เพราะ 'eng' เป็นค่าพื้นฐาน
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('file', new Blob([await import('node:fs').then(fs => fs.readFileSync(filePath))]), 'slip.jpg');

    const ocrResponse: any = await $fetch(ocrApiUrl, {
      method: 'POST',
      body: formData
    });

    if (ocrResponse.IsErroredOnProcessing) {
      console.error('OCR.space Error:', ocrResponse.ErrorMessage);
      return { detectedAmounts: [] };
    }

   const parsedText = ocrResponse.ParsedResults[0]?.ParsedText || '';

    // แบ่งข้อความเป็นบรรทัด
    const lines = parsedText.split('\n');
    const amountRegex = /\b(\d{1,6}\.\d{2})\b/g;
    let potentialAmounts: string[] = [];
    
    // วนลูปหา Keyword
    for (const line of lines) {
        // เพิ่ม Keyword ของแต่ละธนาคารได้ตามต้องการ
        if (line.includes('Amount') || line.includes('จํานวน') || line.includes('ยอด')) {
            const amountsInLine = line.match(amountRegex);
            if (amountsInLine) {
                potentialAmounts.push(...amountsInLine);
            }
        }
    }
    // ถ้าหาจาก Keyword ไม่เจอ ให้กลับไปใช้วิธีหาทั้งหมดแบบเดิมเป็นแผนสำรอง
    if (potentialAmounts.length === 0) {
        potentialAmounts = parsedText.match(amountRegex) || [];
    }

    const detectedAmounts = potentialAmounts.map(Number);
    return { detectedAmounts };

  } catch (error) {
    console.error('Failed to call OCR API:', error);
    return { detectedAmounts: [] };
  }
}

// --- Main Handler ---
export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    
    const bookingRefEntry = formData?.find(item => item.name === 'booking_ref');
    const payerNameEntry = formData?.find(item => item.name === 'payer_name');
    const paymentTimeEntry = formData?.find(item => item.name === 'payment_timestamp');
    const slipFileEntry = formData?.find(item => item.name === 'slip_file');
    const booking_ref = bookingRefEntry?.data.toString();
    if (!booking_ref || !paymentTimeEntry?.data || !slipFileEntry || !slipFileEntry.filename || !slipFileEntry.data) {
        throw createError({ statusCode: 400, statusMessage: 'ข้อมูลไม่ครบถ้วน' });
    }
    const paymentTimestamp = new Date(paymentTimeEntry.data.toString());
    if (isNaN(paymentTimestamp.getTime())) {
        throw createError({ statusCode: 400, statusMessage: 'รูปแบบวันที่และเวลาไม่ถูกต้อง' });
    }

    const [bookingRows] = await db.query<RowDataPacket[]>("SELECT id, payment_amount FROM bookings WHERE booking_ref = ? AND status = 'PENDING_PAYMENT'", [booking_ref]);
    if (bookingRows.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'ไม่พบเลขที่การจองนี้ หรือการจองได้ถูกดำเนินการไปแล้ว' });
    }
    const expectedAmount = Number(bookingRows[0].payment_amount);

    const fileExtension = slipFileEntry.filename.split('.').pop() || 'jpg';
    const newFilename = `${booking_ref}-${Date.now()}.${fileExtension}`;
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'slips');
    await mkdir(uploadsDir, { recursive: true });
    const filePath = join(uploadsDir, newFilename);
    const fileUrl = `/uploads/slips/${newFilename}`;
    await writeFile(filePath, slipFileEntry.data);

    const ocrResult = await verifySlipWithOCR_English(filePath);
    let finalStatus = 'PENDING_VERIFICATION'; 

    if (ocrResult.detectedAmounts.length > 0) {
      console.log(`Expected Amount: ${expectedAmount}, Detected Amounts on Slip: [${ocrResult.detectedAmounts.join(', ')}]`);
      
      if (ocrResult.detectedAmounts.includes(expectedAmount)) {
        finalStatus = 'CONFIRMED';
        console.log(`Booking ${booking_ref} is auto-confirmed. Amount matched.`);
      } else {
        console.log(`Amount mismatch for ${booking_ref}. Needs manual check.`);
      }
    }

    const sql = `UPDATE bookings SET slip_url = ?, payer_name = ?, payment_timestamp = ?, status = ? WHERE booking_ref = ?`;
    await db.query(sql, [fileUrl, payerNameEntry?.data.toString(), toMySQLDateTime(paymentTimestamp), finalStatus, booking_ref]);

    // *** แก้ไขส่วนนี้ ***
    let responseMessage = 'อัปโหลดสลิปสำเร็จ! ระบบกำลังตรวจสอบข้อมูลสักครู่';
    if (finalStatus === 'CONFIRMED') {
      responseMessage = 'การจองของคุณได้รับการยืนยันเรียบร้อยแล้ว!';
    } else if (ocrResult.detectedAmounts.length > 0) {
      // กรณีนี้คือ OCR ทำงาน แต่ยอดเงินไม่ตรง
      responseMessage = 'อัปโหลดสำเร็จ แต่ระบบไม่สามารถยืนยันยอดเงินอัตโนมัติได้ กรุณารอเจ้าหน้าที่ตรวจสอบ หรือติดต่อร้านค้า';
    } else {
      // กรณีนี้คือ OCR อ่านค่าไม่ได้เลย
      responseMessage = 'อัปโหลดสำเร็จ ไม่สามารถอ่านข้อมูลจากสลิปได้ กรุณารอเจ้าหน้าที่ตรวจสอบ';
    }

   return { 
      success: true, 
      message: responseMessage, // ส่งข้อความที่ปรับปรุงแล้วกลับไป
      finalStatus: finalStatus // ส่งสถานะสุดท้ายกลับไปด้วย
    };

  } catch (error: any) {
    console.error('Slip Upload Error:', error);
    const statusMessage = error.data?.statusMessage || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์';
    throw createError({ statusCode: error.statusCode || 500, statusMessage: statusMessage });
  }
  
});

