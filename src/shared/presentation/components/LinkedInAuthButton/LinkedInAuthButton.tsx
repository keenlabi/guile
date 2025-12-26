import LinkedInLogoIcon from 'src/shared/presentation/assets/icons/linkedin-logo.svg?react';
import Button from '../Button/Button';

interface Props {
  disabled?: boolean;
  isLoading?: boolean;
  onClick: () => void;
  className?: string;
}

export default function LinkedInAuthButton({
  disabled = false,
  isLoading = false,
  onClick,
  className,
}: Props) {
  return (
    <Button
      type="button"
      variant="social"
      disabled={disabled}
      isLoading={isLoading}
      fullWidth
      startIcon={<LinkedInLogoIcon />}
      onClick={onClick}
      className={className}
    >
      Continue with LinkedIn
    </Button>
  );
}