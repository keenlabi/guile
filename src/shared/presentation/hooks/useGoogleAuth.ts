export function useGoogleAuth() {
  const startGoogleLogin = () => {
    const googleLoginUrl = '/api/auth/google';
    window.location.href = googleLoginUrl;
  };

  return { startGoogleLogin };
}