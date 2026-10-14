'use client';

import { z } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import 'react-phone-number-input/style.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';
import SubmitButton from '../SubmitButton';
import { createUser } from '@/lib/actions/patient.actions';
import CustomFormField, { FormFieldType } from '../CustomFormField';
import { getUserFormValidation } from '@/lib/validation';

export const PatientForm = () => {
  const router = useRouter();
  const t = useTranslations('PatientForm');
  const tValidation = useTranslations('Validation');
  const [isLoading, setIsLoading] = useState(false);

  const UserFormValidation = useMemo(
    () => getUserFormValidation(tValidation),
    [tValidation]
  );

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });
const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
  setIsLoading(true);

  try {
    const newUser = await createUser(values);

    if (!newUser?.$id) {
      toast.error(t('errorCreatingAccount'));
      return;
    }

    router.push(`/patients/${newUser.$id}/register`);
  } catch (error) {
    console.error('Error creating patient:', error);
    toast.error(t('errorCreatingAccount'));
  } finally {
    setIsLoading(false);
  }
};
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
      <section className="mb-12 space-y-4">
        <h1 className="header">{t('greeting')}</h1>
        <p className="text-dark-700">{t('subtitle')}</p>
      </section>

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="name"
        label={t('nameLabel')}
        placeholder={t('namePlaceholder')}
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"
      />

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="email"
        label={t('emailLabel')}
        placeholder={t('emailPlaceholder')}
        iconSrc="/assets/icons/email.svg"
        iconAlt="email"
      />

      <CustomFormField
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name="phone"
        label={t('phoneLabel')}
        placeholder={t('phonePlaceholder')}
      />

      <SubmitButton isLoading={isLoading}>{t('submit')}</SubmitButton>
    </form>
  );
};