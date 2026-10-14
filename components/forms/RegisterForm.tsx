
'use client';

import { z } from 'zod';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import 'react-phone-number-input/style.css';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import { Label } from '../ui/label';
import { SelectItem } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

import SubmitButton from '../SubmitButton';
import FileUploader from '../FileUploader';
import CustomFormField, { FormFieldType } from '../CustomFormField';

import { getPatientFormValidation } from '@/lib/validation';
import { registerPatient } from '@/lib/actions/patient.actions';

import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from '@/constants';

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const tValidation = useTranslations('Validation');

  const PatientFormValidation = useMemo(
    () => getPatientFormValidation(tValidation),
    [tValidation]
  );
const form = useForm<
  z.input<typeof PatientFormValidation>,
  undefined,
  z.output<typeof PatientFormValidation>
>({
  resolver: zodResolver(PatientFormValidation),
  defaultValues: {
    ...PatientFormDefaultValues,
    name: '',
    email: '',
    phone: '',
  },
});

  const onSubmit = async (
    values: z.infer<typeof PatientFormValidation>
  ) => {
    setIsLoading(true);

    try {
      let formData: FormData | undefined;

      if (
        values.identificationDocument &&
        values.identificationDocument.length > 0
      ) {
        const file = values.identificationDocument[0];

        const blobFile = new Blob([file], {
          type: file.type,
        });

        formData = new FormData();
        formData.append('blobFile', blobFile);
        formData.append('fileName', file.name);
      }

      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };

      // @ts-ignore
      const patient = await registerPatient(patientData);

      if (patient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.error('Error registering patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex-1 space-y-12"
    >
      <section className="space-y-4">
        <h1 className="header">Welcome 👋</h1>
        <p className="text-dark-700">
          Let us know more about yourself.
        </p>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Personal information</h2>
        </div>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row w-auto h-auto">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of birth"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <RadioGroup
                className="flex h-11 gap-6 xl:justify-between"
                onValueChange={field.onChange}
                value={field.value}
              >
                {GenderOptions.map((option, i) => (
                  <div
                    key={`${option}-${i}`}
                    className="radio-group"
                  >
                    <RadioGroupItem
                      value={option}
                      id={option}
                    />
                    <Label
                      htmlFor={option}
                      className="cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="14 street, New York, NY - 5101"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency contact name"
            placeholder="Guardian's name"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency contact number"
            placeholder="(555) 123-4567"
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Medical information</h2>
        </div>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary care physician"
          placeholder="Select a physician"
        >
          {Doctors.map((doctor, i) => (
            <SelectItem
              key={`${doctor.name}-${i}`}
              value={doctor.name}
            >
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt={doctor.name}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance provider"
            placeholder="BlueCross BlueShield"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance policy number"
            placeholder="ABC123456789"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillin, Pollen"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current medications (if any)"
            placeholder="Ibuprofen 200mg, Paracetamol 500mcg"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family medical history (if relevant)"
            placeholder="Mother had brain cancer, Father has hypertension"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">
            Identification and verification
          </h2>
        </div>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select identification type"
        >
          {IdentificationTypes.map((type, i) => (
            <SelectItem
              key={`${type}-${i}`}
              value={type}
            >
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="123456789"
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned Copy of Identification Document"
          renderSkeleton={(field) => (
            <FileUploader
              files={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Consent and Privacy</h2>
        </div>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to receive treatment for my health condition."
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to the use and disclosure of my health information for treatment purposes."
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I acknowledge that I have reviewed and agree to the privacy policy."
        />
      </section>

      <SubmitButton isLoading={isLoading}>
        Get Started
      </SubmitButton>
    </form>
  );
};

export default RegisterForm;