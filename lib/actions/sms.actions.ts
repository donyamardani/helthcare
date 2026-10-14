// lib/actions/sms.actions.ts
"use server";

const LIMO_API_KEY = process.env.LIMO_SMS_API_KEY!;
const LIMO_SENDER_NUMBER = process.env.LIMO_SMS_SENDER!;

type SendSmsResponse = {
  Success: boolean;
  Message: string;
  MessageId: string[];
};

export const sendSMS = async (
  mobileNumbers: string | string[],
  message: string
): Promise<SendSmsResponse | undefined> => {
  try {
    const numbers = Array.isArray(mobileNumbers) ? mobileNumbers : [mobileNumbers];

    const response = await fetch("https://api.limosms.com/api/sendsms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ApiKey: LIMO_API_KEY,
      },
      body: JSON.stringify({
        SenderNumber: LIMO_SENDER_NUMBER,
        Message: message,
        MobileNumber: numbers,
      }),
    });

    const data: SendSmsResponse = await response.json();

    if (!data.Success) {
      console.error("ارسال پیامک ناموفق بود:", data.Message);
    }

    return data;
  } catch (error) {
    console.error("خطا در ارتباط با لیمو اس‌ام‌اس:", error);
  }
};