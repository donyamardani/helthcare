'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Appointment } from '@/types/appwrite.types';

import AppointmentForm from './forms/AppointmentForm';

import 'react-datepicker/dist/react-datepicker.css';

export const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
}: {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: 'schedule' | 'cancel';
}) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('AppointmentModal');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
  render={
    <Button
      variant="ghost"
      className={type === 'schedule' ? 'text-green-500' : ''}
    />
  }
>
  {t(type === 'schedule' ? 'schedule' : 'cancel')}
</DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle>
            {t(type === 'schedule' ? 'scheduleTitle' : 'cancelTitle')}
          </DialogTitle>
          <DialogDescription>
            {t(type === 'schedule' ? 'scheduleDesc' : 'cancelDesc')}
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};