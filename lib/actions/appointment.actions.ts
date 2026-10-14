 'use server';

import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';

import { formatDateTime, parseStringify } from '../utils';
import { sendSMS } from './sms.actions';
import { getUser } from './patient.actions';
import type { Appointment } from '@/types/appwrite.types';
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from '../appwrite.config';

type SupportedLocale = 'fa' | 'en';

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
    console.error('Error creating appointment:', error);
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
    console.error('Error fetching appointment:', error);
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

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };
const counts = appointments.documents.reduce(
  (acc, document) => {
    const status = document.status;

    if (status === 'scheduled') {
      acc.scheduledCount++;
    } else if (status === 'pending') {
      acc.pendingCount++;
    } else if (status === 'cancelled') {
      acc.cancelledCount++;
    }

    return acc;
  },
  initialCounts
);

    return parseStringify({
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    });
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    throw error;
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
  locale = 'fa',
}: UpdateAppointmentParams & { locale?: SupportedLocale }) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    const normalizedLocale: SupportedLocale =
      locale === 'en' ? 'en' : 'fa';

    // Send the SMS in the selected language.
    try {
      const t = await getTranslations({
        locale: normalizedLocale,
        namespace: 'SMS',
      });

      const scheduleValue = appointment.schedule;

      if (scheduleValue) {
        const { dateTime } = formatDateTime(
          scheduleValue,
          normalizedLocale === 'fa' ? 'fa-IR' : 'en-US'
        );

        const smsMessage =
          type === 'schedule'
            ? t('scheduled', {
                dateTime,
                doctor: appointment.primaryPhysician,
              })
            : t('cancelled', {
                dateTime,
                reason: appointment.cancellationReason ?? '',
              });

        const user = await getUser(userId);

        if (user?.phone) {
          await sendSMS(user.phone, smsMessage);
        } else {
          console.warn(
            'Appointment updated, but no patient phone number was found.'
          );
        }
      } else {
        console.warn(
          'Appointment updated, but no schedule date was provided for the SMS.'
        );
      }
    } catch (smsError) {
      // The appointment has already been updated.
      // An SMS failure should not report the database update as failed.
      console.error(
        'Appointment updated, but sending the SMS failed:',
        smsError
      );
    }

    revalidatePath('/admin');

    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};