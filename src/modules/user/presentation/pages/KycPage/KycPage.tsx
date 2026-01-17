import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react';
import styles from './KycPage.module.css';
import { ROUTES } from 'src/shared/presentation/routes/routes';
import { useKyc } from '../../hooks/useKyc';
import { KycDocumentType, type KycSubmissionData } from 'src/modules/user/domain/kyc.types';

interface FileState {
  file: File | null;
  previewUrl: string | null;
}

export const KycPage = () => {
  
  const navigate = useNavigate();
  // const context = useContext(AuthContext);

  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<KycSubmissionData>({
    firstName: '',
    lastName: '',
    dob: '',
    country: '',
    documentType: KycDocumentType.ID_CARD,
    documentFront: null,
    documentBack: null
  });

  const [frontDoc, setFrontDoc] = useState<FileState>({ file: null, previewUrl: null });
  const [backDoc, setBackDoc] = useState<FileState>({ file: null, previewUrl: null });
  const [selfie, setSelfie] = useState<FileState>({ file: null, previewUrl: null });

  const { submitKyc, isLoading } = useKyc();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFileState: React.Dispatch<React.SetStateAction<FileState>>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        setError('Only image and PDF files are allowed');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setFileState({ file, previewUrl });
      setError(null);
    }
  };

  const clearFile = (setFileState: React.Dispatch<React.SetStateAction<FileState>>) => {
    setFileState((prev) => {
      if (prev.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return { file: null, previewUrl: null };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    // setIsLoading(true);

    // if (!frontDoc.file) {
    //   setError('Front of document is required.');
    //   setIsLoading(false);
    //   return;
    // }

    try {
      // const data = new FormData();
      // // Append text fields
      // Object.entries(formData).forEach(([key, value]) => {
      //   data.append(key, value);
      // });

      // // Append files
      // data.append('documentFront', frontDoc.file);
      // if (backDoc.file) data.append('documentBack', backDoc.file);
      // if (selfie.file) data.append('selfie', selfie.file);
    
      // Construct the data object
      await submitKyc(formData);

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'KYC submission failed');
      // }

      setSuccess(true);
      // await context.refreshProfile();
      setTimeout(() => {
        navigate(ROUTES.PROFILE);
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <CheckCircle size={64} className={styles.successIcon} />
          <h2 className={styles.successTitle}>KYC Submitted Successfully!</h2>
          <p className={styles.successMessage}>
            Your verification documents have been received. Our team will review them shortly. You will be redirected to your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Identity Verification</h1>
          <p className={styles.subtitle}>Please provide your personal details and upload a valid government-issued ID.</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Personal Details Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Personal Information</h3>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName" className={styles.label}>First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className={styles.input} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName" className={styles.label}>Last Name</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className={styles.input} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="dob" className={styles.label}>Date of Birth</label>
                <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleInputChange} className={styles.input} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="country" className={styles.label}>Country of Residence</label>
                <input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} className={styles.input} required />
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Document Upload</h3>
            
            <div className={styles.inputGroup} style={{marginBottom: '2rem'}}>
              <label htmlFor="documentType" className={styles.label}>Document Type</label>
              <select id="documentType" name="documentType" value={formData.documentType} onChange={handleInputChange} className={styles.select}>
                <option value="ID_CARD">National ID Card</option>
                <option value="PASSPORT">Passport</option>
                <option value="DRIVERS_LICENSE">Driver's License</option>
              </select>
            </div>

            <div className={styles.uploadGrid}>
              {/* Front Side Upload */}
              <FileUpload
                id="frontDoc"
                label="Front Side"
                fileState={frontDoc}
                onFileChange={(e) => handleFileChange(e, setFrontDoc)}
                onClear={() => clearFile(setFrontDoc)}
                required
              />

              {/* Back Side Upload (Conditional) */}
              {formData.documentType !== 'PASSPORT' && (
                <FileUpload
                  id="backDoc"
                  label="Back Side"
                  fileState={backDoc}
                  onFileChange={(e) => handleFileChange(e, setBackDoc)}
                  onClear={() => clearFile(setBackDoc)}
                />
              )}
              
              {/* Selfie Upload */}
               <FileUpload
                id="selfie"
                label="Back Side"
                fileState={selfie}
                required
                onFileChange={(e) => handleFileChange(e, setSelfie)}
                onClear={() => clearFile(setSelfie)}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Submit for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper Component for File Upload
interface FileUploadProps {
  id: string;
  label: string;
  fileState: FileState;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  required?: boolean;
}

const FileUpload = ({ id, label, fileState, onFileChange, onClear, required }: FileUploadProps) => {
  return (
    <div className={styles.uploadContainer}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      {fileState.file ? (
        <div className={styles.previewContainer}>
          {fileState.file.type.startsWith('image/') ? (
            <img src={fileState.previewUrl!} alt={`${label} preview`} className={styles.previewImage} />
          ) : (
            <div className={styles.filePreview}>
              <FileText size={32} />
              <span>{fileState.file.name}</span>
            </div>
          )}
          <button type="button" className={styles.clearBtn} onClick={onClear}>
            <X size={18} />
          </button>
        </div>
      ) : (
        <>
          <input type="file" id={id} accept="image/jpeg,image/png,image/jpg,application/pdf" onChange={onFileChange} className={styles.fileInput} hidden />
          <label htmlFor={id} className={styles.uploadBox}>
            <Upload size={32} className={styles.uploadIcon} />
            <span className={styles.uploadText}>Click to upload or drag and drop</span>
            <span className={styles.uploadHint}>JPG, PNG or PDF (max. 5MB)</span>
          </label>
        </>
      )}
    </div>
  );
};