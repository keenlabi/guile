import styles from './LoginForm.module.css';
import { Link } from 'react-router-dom';

// Shared Components
import Form from '../../../../../shared/presentation/components/FormFields/Form/Form';
import InputField from '../../../../../shared/presentation/components/FormFields/InputField/InputField';
import PasswordField from '../../../../../shared/presentation/components/FormFields/PasswordField/PasswordField';
import Button from '../../../../../shared/presentation/components/Button/Button';
import GoogleAuthButton from '../../../../../shared/presentation/components/GoogleAuthButton/GoogleAuthButton';

// Logic
import useLoginForm from './useLoginForm';

export function LoginForm() {
  const {
    register,
    submit,
    errors,
    isLoginLoading,
    loginError,
    startGoogleLogin
  } = useLoginForm();

  return (
    <div className={styles.formWrapper}>
      <h1 className={styles.title}>Welcome back</h1>

      <div className={styles.socialStack}>
        <GoogleAuthButton 
          onClick={startGoogleLogin} 
          isLoading={false}
        />
      </div>

      <Form submit={submit} className={styles.form}>
        <div className={styles.inputs}>
          <InputField
            label=""
            placeholder="email@example.com" // Matches image cursor implication
            type="email"
            error={errors.email?.message}
            containerClassName={styles.inputSpacing}
            {...register('email')}
          />

          <div className={styles.passwordWrapper}>
            <PasswordField
              label=""
              placeholder="Enter Password"
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

          <p className={styles.footerText}>
            Don’t have an Account <Link to="/signup" className={styles.signUpLink}>Sign up</Link>
          </p>
        </div>
      </Form>
    </div>
  );
}