import GoogleLogoIcon from 'src/shared/presentation/assets/icons/google-logo.svg?react';
import Button from '../Button/Button';

interface Props {
  disabled?: boolean;
  isLoading?: boolean;
  onClick: () => void;
  className?: string;
}

export default function GoogleAuthButton({
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
      startIcon={<GoogleLogoIcon />}
      onClick={onClick}
      className={className}
    >
      Continue with Google
    </Button>
  );
}