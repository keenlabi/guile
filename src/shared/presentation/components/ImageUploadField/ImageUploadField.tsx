import React, { useRef, useState, useEffect } from 'react';
import styles from './ImageUploadField.module.css';
import UploadIcon from 'src/shared/presentation/assets/icons/upload-icon.svg?react'; // Assuming you have an icon
// import CloseIcon from 'src/shared/presentation/assets/icons/close.svg?react'; // Assuming you have an icon

interface ImageUploadFieldProps {
  label?: string;
  error?: string;
  value?: string | File | null; // Can be a URL string or a File object
  onChange: (file: File | null) => void;
  accept?: string; // e.g. "image/png, image/jpeg"
  className?: string;
}

export function ImageUploadField({
  label,
  error,
  value,
  onChange,
  accept = "image/*",
  className,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle generating preview URL from File or String
  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    if (typeof value === 'string') {
      setPreviewUrl(value);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);
      
      // Cleanup memory when component unmounts or value changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the file input
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = ''; // Reset input value
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {label && <label className={styles.label}>{label}</label>}

      <div 
        className={`${styles.uploadArea} ${error ? styles.error : ''}`} 
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className={styles.hiddenInput}
        />

        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            <button 
              type="button" 
              className={styles.removeBtn} 
              onClick={handleRemove}
              aria-label="Remove image"
            >
              {/* <CloseIcon style={{ width: 16, height: 16, fill: 'currentColor' }} /> */}
            </button>
          </>
        ) : (
          <div className={styles.placeholderContent}>
            <UploadIcon className={styles.icon} />
            <div className={styles.textWrapper}>
              <p className={styles.instruction}>Click to upload image</p>
              <p className={styles.subInstruction}>SVG, PNG, JPG (max. 5MB)</p>
            </div>
          </div>
        )}
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}