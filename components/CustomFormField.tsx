import Image from 'next/image';
import DatePicker from 'react-datepicker';
import { Controller, Control ,FieldValues, FieldPath } from 'react-hook-form';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { E164Number } from 'libphonenumber-js/core';
import 'react-datepicker/dist/react-datepicker.css';

import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';


export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
}

interface CustomProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  fieldType: FormFieldType;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  description?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}
const RenderField = <TFieldValues extends FieldValues = FieldValues>({
  field,
  props,
}: {
  field: any;
  props: CustomProps<TFieldValues>;
}) => {
  const {
    fieldType,
    iconSrc,
    iconAlt,
    placeholder,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
  } = props;
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              className="ms-2"
              height={24}
              width={24}
              alt={iconAlt || 'icon'}
            />
          )}
          <Input
            {...field}
            id={field.name}
            className="shad-input border-0"
            placeholder={placeholder}
          />
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <PhoneInput
          defaultCountry="IR"
          placeholder={placeholder}
          international
          withCountryCallingCode
          value={field.value as E164Number | undefined}
          onChange={field.onChange}
          className="input-phone"
        />
      );
    case FormFieldType.TEXTAREA:
      return (
        <Textarea
          placeholder={placeholder}
          {...field}
          id={field.name}
          className="shad-textArea"
          disabled={props.disabled}
        />
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="calendar"
            className="ms-2"
          />
          <DatePicker
            selected={field.value}
            onChange={(date: Date | null) => field.onChange(date)}
            dateFormat={dateFormat ?? 'MM/dd/yyyy'}
            showTimeSelect={showTimeSelect ?? false}
            timeInputLabel="Time:"
            wrapperClassName="date-picker"
          />
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="shad-select-trigger" id={field.name}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="shad-select-content">
            {props.children}
          </SelectContent>
        </Select>
      );
    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;
    case FormFieldType.CHECKBOX:
      return (
        <div className="flex items-center gap-4">
          <Checkbox
            id={props.name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <label htmlFor={props.name} className="checkbox-label">
            {props.label}
          </label>
        </div>
      );
    default:
      return null;
  }
};


const CustomFormField = <TFieldValues extends FieldValues = FieldValues>(
  props: CustomProps<TFieldValues>
) => {
  const { control, fieldType, name, label } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={!!fieldState.error} className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
          )}

          <RenderField<TFieldValues> field={field} props={props} />

          {fieldState.error && (
            <FieldError className="shad-error">
              {fieldState.error.message}
            </FieldError>
          )}
        </Field>
      )}
    />
  );
};
export default CustomFormField;