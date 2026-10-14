'use server';

import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';

import { formatDateTime, parseStringify } from '../utils';
import { sendSMS } from './sms.actions'; // ← تابع لیمو اس‌ام‌اس که قبلاً ساختیم
import { getUser } from './patient.actions'; // ← برای گرفتن شماره تلفن از روی userId
import { Appointment } from '@/types/appwrite.types';
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from '../appwrite.config';

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    return parseStringify(newAppointment);
  } catch (error) {
    console.error('خطا در ایجاد نوبت:', error); // ← دیگه خالی نیست
    throw error;
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.error('خطا در دریافت نوبت:', error);
    throw error;
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')]
    );

    const initialCounts = { scheduledCount: 0, pendingCount: 0, cancelledCount: 0 };

    const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
      if (appointment.status === 'scheduled') acc.scheduledCount++;
      else if (appointment.status === 'pending') acc.pendingCount++;
      else if (appointment.status === 'cancelled') acc.cancelledCount++;
      return acc;
    }, initialCounts);

    return parseStringify({
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    });
  } catch (error) {
    console.error('خطا در دریافت لیست نوبت‌ها:', error);
    throw error;
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
  locale = 'fa', // ← پارامتر جدید: زبان فعلی کاربر، برای ترجمه‌ی متن پیامک
}: UpdateAppointmentParams & { locale?: string }) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      throw new Error('نوبت یافت نشد');
    }

    // ترجمه‌ی متن پیامک بر اساس زبان کاربر
    const t = await getTranslations({ locale, namespace: 'SMS' });
    const { dateTime } = formatDateTime(appointment.schedule!, locale === 'fa' ? 'fa-IR' : 'en-US');

    const smsMessage =
      type === 'schedule'
        ? t('scheduled', { dateTime, doctor: appointment.primaryPhysician })
        : t('cancelled', { dateTime, reason: appointment.cancellationReason ?? '' });

    // شماره‌ی تلفن کاربر رو از Appwrite می‌گیریم (چون لیمو به شماره نیاز داره، نه userId)
    const user = await getUser(userId);
    if (user?.phone) {
      await sendSMS(user.phone, smsMessage);
    }

    revalidatePath(`/admin`);

    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error('خطا در به‌روزرسانی نوبت:', error);
    throw error;
  }
};