import InputField, { type InputFieldProps } from '../InputField/InputField';
import styles from './SearchField.module.css';
import SearchIcon from 'src/shared/presentation/assets/icons/search.svg?react';

interface SearchFieldProps extends Omit<InputFieldProps, 'label' | 'prefixIcon'> {
  placeholder?: string;
  className?: string;
}

export default function SearchField({ 
  placeholder = "Search...", 
  className,
  ...props 
}: SearchFieldProps) {
  return (
    <InputField
      label="Search" 
      placeholder={placeholder}
      prefixIcon={<SearchIcon />}
      containerClassName={`${styles.searchContainer} ${className || ''}`}
      wrapperClassName={styles.searchWrapper} 
      className={styles.searchInput}
      {...props}
    />
  );
}