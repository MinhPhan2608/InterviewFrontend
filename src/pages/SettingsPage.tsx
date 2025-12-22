import { Settings as SettingsIcon, User, Globe, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth, useTheme, useLanguage } from '@/contexts';
import { useMemo } from 'react';

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const themeOpts = useMemo(() => [
    { value: 'light' as const, label: t('lightMode') || 'Light', icon: Sun },
    { value: 'dark' as const, label: t('darkMode') || 'Dark', icon: Moon },
  ], [t]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          {t('settings')}
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">{t('manageAccount')}</p>
      </div>

      {/* Profile Section */}
      <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          {t('profile')}
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">{user?.username || 'User'}</p>
            <p className="text-[var(--color-text-secondary)]">{t('administrator')}</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            {t('appearance')}
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">{t('themeSettings') || 'Theme'}</p>
            <div className="grid grid-cols-2 gap-3">
              {themeOpts.map((opt) => {
                const Icon = opt.icon;
                const active = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                      active
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50'
                    } ${active ? 'gap-2' : 'gap-3'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t('languageRegion') || 'Language'}
          </h2>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              {t('selectLanguage') || 'Select language'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLanguage('vi')}
                className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition ${
                  language === 'vi'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50'
                } ${language === 'vi' ? 'gap-2' : 'gap-3'}`}
              >
                <span className="font-medium">Tiếng Việt</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition ${
                  language === 'en'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50'
                } ${language === 'en' ? 'gap-2' : 'gap-3'}`}
              >
                <span className="font-medium">English</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
