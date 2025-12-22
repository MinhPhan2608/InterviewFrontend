import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '@/contexts';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [apiErr, setApiErr] = useState<string | null>(null);
  
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const validate = (): boolean => {
    const errs: typeof errors = {};

    if (!username.trim()) {
      errs.username = t('usernameRequired') || 'Username is required';
    } else if (username.length < 3) {
      errs.username = t('usernameMinLength') || 'Username too short';
    }

    if (!password) {
      errs.password = t('passwordRequired') || 'Password is required';
    } else if (password.length < 6) {
      errs.password = t('passwordMinLength') || 'Password too short';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiErr(null);

    if (!validate()) return;

    try {
      await login({ username, password });
      navigate('/dashboard');
    } catch {
      setApiErr(t('invalidCredentials') || 'Invalid credentials');
    }
  };

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: undefined }));
    }
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary)] flex items-start justify-center p-4 pt-20">
      <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">G-Scores</h1>
        </div>

        {/* Login Form Card */}
        <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] text-center mb-6">
            {t('welcomeBack') || 'Welcome Back'}
          </h2>

          {/* API Error Alert */}
          {apiErr && (
            <div className="mb-4 p-4 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded-lg text-[var(--color-danger)] text-sm">
              {apiErr}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
              >
                {t('username') || 'Username'}
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={onUsernameChange}
                placeholder={t('enterUsername') || 'Enter username'}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] ${
                  errors.username
                    ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)] bg-[var(--color-danger)]/5'
                    : 'border-[var(--color-border)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]'
                }`}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
              >
                {t('password') || 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={onPasswordChange}
                  placeholder={t('enterPassword') || 'Enter password'}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition pr-12 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] ${
                    errors.password
                      ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)] bg-[var(--color-danger)]/5'
                      : 'border-[var(--color-border)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('signingIn') || 'Signing in...'}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {t('signIn') || 'Sign In'}
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-6 p-4 bg-[var(--color-primary)]/10 rounded-lg">
            <p className="text-sm text-[var(--color-primary)] font-medium mb-1">{t('demoCredentials') || 'Demo Credentials'}</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t('username') || 'Username'}: <span className="font-mono bg-[var(--color-bg-tertiary)] px-1 rounded">test</span>
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t('password') || 'Password'}: <span className="font-mono bg-[var(--color-bg-tertiary)] px-1 rounded">test123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
