'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from './ui/button';

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  const t = useTranslations('Common');

  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? 'shad-primary-btn w-full'}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          {t('loading')}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;