import styles from './LoginForm.module.css';
import { Link } from 'react-router-dom';

// Shared Components
import Form from '../../../../../shared/presentation/components/FormFields/Form/Form';
import InputField from '../../../../../shared/presentation/components/FormFields/InputField/InputField';
import PasswordField from '../../../../../shared/presentation/components/FormFields/PasswordField/PasswordField';
import Button from '../../../../../shared/presentation/components/Button/Button';

// Logic
import useLoginForm from './useLoginForm';
import { ROUTES } from 'src/shared/presentation/routes/routes';

export function LoginForm() {
  const {
    register,
    submit,
    errors,
    isLoginLoading,
    loginError,
  } = useLoginForm();

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.title}>Log In</h2>

      <Form submit={submit} className={styles.form}>
        <div className={styles.inputs}>
          <InputField
            label="Email"
            placeholder="email@example.com" // Matches image cursor implication
            type="email"
            error={errors.email?.message}
            containerClassName={styles.inputSpacing}
            {...register('email')}
          />

          <div className={styles.passwordWrapper}>
            <PasswordField
              label="Password"
              placeholder="**********"
              error={errors.password?.message}
              register={register('password')}
            />
            <Link to="/forgot-password" className={styles.forgotPassword}>
              Forgot your Password?
            </Link>
          </div>
        </div>

        <div className={styles.actionArea}>
          {loginError && <p className={styles.apiError}>{loginError}</p>}
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            isLoading={isLoginLoading}
          >
            Sign in
          </Button>

          {/* Footer */}
          <div className={styles.footer}>
            <span className={styles.footerText}>Don’t have an Account</span>
            <Link to={ROUTES.SIGNUP} className={styles.footerLink}>Sign up</Link>
          </div>
        </div>
      </Form>
    </div>
  );
}