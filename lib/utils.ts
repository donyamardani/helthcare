import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// FORMAT DATE TIME — اکنون locale-aware است
export const formatDateTime = (
  dateString: Date | string,
  locale: string = 'en-US'
) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // نام کوتاه ماه (مثلاً 'Oct')
    day: 'numeric', // روز ماه (مثلاً '25')
    year: 'numeric', // سال (مثلاً '2023')
    hour: 'numeric', // ساعت (مثلاً '8')
    minute: 'numeric', // دقیقه (مثلاً '30')
    hour12: true, // ساعت ۱۲ ساعته
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // نام کوتاه روز هفته (مثلاً 'Mon')
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const date = new Date(dateString);

  const formattedDateTime: string = date.toLocaleString(locale, dateTimeOptions);
  const formattedDateDay: string = date.toLocaleString(locale, dateDayOptions);
  const formattedDate: string = date.toLocaleString(locale, dateOptions);
  const formattedTime: string = date.toLocaleString(locale, timeOptions);

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}