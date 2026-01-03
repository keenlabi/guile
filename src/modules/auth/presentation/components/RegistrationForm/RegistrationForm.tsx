import styles from './RegistrationForm.module.css';
// Icons
import MailIcon from 'src/shared/presentation/assets/icons/envelope.svg?react';
// form fields
import InputField from '../../../../../shared/presentation/components/FormFields/InputField/InputField';
import Button from '../../../../../shared/presentation/components/Button/Button';
import PasswordField from '../../../../../shared/presentation/components/FormFields/PasswordField/PasswordField';
import Form from '../../../../../shared/presentation/components/FormFields/Form/Form';
import useRegistrationForm from './useRegistrationForm';
import { Link } from 'react-router-dom';
import { ROUTES } from 'src/shared/presentation/routes/routes';

export function RegistrationForm() {
  const {
    register,
    submit,
    errors,
    isValid,
    isLoading,
    apiError,
  } = useRegistrationForm();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Welcome to Guile</h2>
      </header>

      <Form submit={submit} className={styles.form}>
        
        <InputField
          label="Email"
          placeholder="email@example.com"
          type="email"
          error={errors.email?.message}
          suffixIcon={<MailIcon />}
          containerClassName={styles.inputSpacing}
          {...register('email')}
        />

        <PasswordField
          label="Password"
          placeholder="*********"
          error={errors.password?.message}
          register={register('password')}
        />

        {/* Terms Checkbox */}
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              {...register('agreeToTerms')}
            />
            <span className={styles.checkboxText}>
              I've read and agree to the terms.
            </span>
          </label>
          {errors.agreeToTerms && <span className={styles.errorText}>{errors.agreeToTerms.message}</span>}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          isLoading={isLoading}
          disabled={isValid !== true || isLoading}
        >
          Create Account
        </Button>

        {apiError && <p className={styles.apiError}>{apiError}</p>}

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerText}>I have an Account</span>
          <Link to={ROUTES.LOGIN} className={styles.footerLink}>Sign In</Link>
        </div>
      </Form>
    </div>
  );
}