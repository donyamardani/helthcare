import { z } from 'zod';
import type { useTranslations } from 'next-intl';

type TFunction = ReturnType<typeof useTranslations>;

export const getUserFormValidation = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(2, t('nameMin'))
      .max(50, t('nameMax')),
    email: z.string().email(t('emailInvalid')),
    phone: z
      .string()
      .refine((phone) => /^\+\d{10,15}$/.test(phone), t('phoneInvalid')),
  });

export const getPatientFormValidation = (t: TFunction) =>
  getUserFormValidation(t).extend({
    birthDate: z.coerce.date(),
    gender: z.enum(['male', 'female', 'other']),
    address: z.string().min(5, t('addressMin')).max(500, t('addressMax')),
    occupation: z.string().min(2, t('occupationMin')).max(500, t('occupationMax')),
    emergencyContactName: z
      .string()
      .min(2, t('emergencyNameMin'))
      .max(50, t('emergencyNameMax')),
    emergencyContactNumber: z
      .string()
      .refine((v) => /^\+\d{10,15}$/.test(v), t('phoneInvalid')),
    primaryPhysician: z.string().min(2, t('selectDoctor')),
    insuranceProvider: z
      .string()
      .min(2, t('insuranceNameMin'))
      .max(50, t('insuranceNameMax')),
    insurancePolicyNumber: z
      .string()
      .min(2, t('policyNumberMin'))
      .max(50, t('policyNumberMax')),
    allergies: z.string().optional(),
    currentMedication: z.string().optional(),
    familyMedicalHistory: z.string().optional(),
    pastMedicalHistory: z.string().optional(),
    identificationType: z.string().optional(),
    identificationNumber: z.string().optional(),
    identificationDocument: z.custom<File[]>().optional(),
    treatmentConsent: z
      .boolean()
      .default(false)
      .refine((v) => v === true, { message: t('consentRequired') }),
    disclosureConsent: z
      .boolean()
      .default(false)
      .refine((v) => v === true, { message: t('consentRequired') }),
    privacyConsent: z
      .boolean()
      .default(false)
      .refine((v) => v === true, { message: t('consentRequired') }),
  });

export const getCreateAppointmentSchema = (t: TFunction) =>
  z.object({
    primaryPhysician: z.string().min(2, t('selectDoctor')),
    schedule: z.coerce.date(),
    reason: z.string().min(2, t('reasonMin')).max(500, t('reasonMax')),
    note: z.string().optional(),
    cancellationReason: z.string().optional(),
  });

export const getScheduleAppointmentSchema = (t: TFunction) =>
  z.object({
    primaryPhysician: z.string().min(2, t('selectDoctor')),
    schedule: z.coerce.date(),
    reason: z.string().optional(),
    note: z.string().optional(),
    cancellationReason: z.string().optional(),
  });

export const getCancelAppointmentSchema = (t: TFunction) =>
  z.object({
    primaryPhysician: z.string().min(2, t('selectDoctor')),
    schedule: z.coerce.date(),
    reason: z.string().optional(),
    note: z.string().optional(),
    cancellationReason: z
      .string()
      .min(2, t('cancellationReasonMin'))
      .max(500, t('cancellationReasonMax')),
  });

export function getAppointmentSchema(type: 'create' | 'cancel' | 'schedule', t: TFunction) {
  switch (type) {
    case 'create':
      return getCreateAppointmentSchema(t);
    case 'cancel':
      return getCancelAppointmentSchema(t);
    default:
      return getScheduleAppointmentSchema(t);
  }
}