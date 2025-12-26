import styles from './RegistrationForm.module.css';
// Icons
import MailIcon from '../../../../../shared/presentation/assets/icons/envelope.svg?react';
// form fields
import InputField from '../../../../../shared/presentation/components/FormFields/InputField/InputField';
import Button from '../../../../../shared/presentation/components/Button/Button';
import PasswordField from '../../../../../shared/presentation/components/FormFields/PasswordField/PasswordField';
import Form from '../../../../../shared/presentation/components/FormFields/Form/Form';
import useRegistrationForm from './useRegistrationForm';
import { Link } from 'react-router-dom';
import GoogleAuthButton from '../../../../../shared/presentation/components/GoogleAuthButton/GoogleAuthButton';

export function RegistrationForm() {
  const {
    register,
    submit,
    errors,
    isValid,
    isLoading,
    apiError,
    startGoogleLogin,
  } = useRegistrationForm();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={'heading-medium'}>Build your life in canada</div>
        <p className={'subtitle-regular'}>
          Real connections, local support, and opportunities that matter.
        </p>
      </header>

      <Form submit={submit} className={styles.form}>
        
        <InputField
          label=""
          placeholder="Enter your email"
          type="email"
          error={errors.email?.message}
          suffixIcon={<MailIcon />}
          containerClassName={styles.inputSpacing}
          {...register('email')}
        />

        <PasswordField
          label=""
          placeholder="Enter Password"
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

        <div className={styles.divider}>
          <span>Or</span>
        </div>

        {/* Social Login */}
        <div className={styles.socialButtons}>
          <GoogleAuthButton
            isLoading={false}
            onClick={startGoogleLogin}
          />

          {/* <LinkedInAuthButton
            isLoading={false}
            onClick={() => {}}
          /> */}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerText}>I have an Account</span>
          <Link to="/login" className={styles.footerLink}>Sign In</Link>
        </div>
      </Form>
    </div>
  );
}