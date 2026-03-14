import {
  createContext,
  ReactNode,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';
import localStore from '../data/localStore.ts';
import { createTheme, PaletteMode } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { generateGlobalTheme } from '../theme';
import { LoadingProvider } from './LoadingProvider.tsx';
import { SnackbarProvider } from './SnackbarProvider.tsx';
import { useTranslation } from 'react-i18next';
import { en } from 'yup-locales';
import { setLocale as setYupLocale } from 'yup';
import * as locales from '@mui/material/locale';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en.js';
import { UserContextProvider } from './UserProvider.tsx';

type SupportedLocales = keyof typeof locales;

interface ColorModeContextType {
  toggleColorMode: () => void;
  setColorMode: (mode: PaletteMode) => void;
}
export const ColorModeContext = createContext({} as ColorModeContextType);

const MyFinThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>(localStore.getUiMode());
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        localStore.toggleUiMode();
      },
      setColorMode: (mode: PaletteMode) => {
        setMode(mode);
        localStore.setUiMode(mode);
      },
    }),
    [mode],
  );

  const [locale, setLocale] = useState<SupportedLocales>('enUS');
  const [dayJsLocale, setDayJsLocale] = useState<'en'>('en');
  const theme = useMemo(
    () => createTheme(generateGlobalTheme(mode), locales[locale]),
    [mode, locale],
  );
  const { i18n } = useTranslation();

  function setAppLocale(language: string) {
    switch (language) {
      case 'uz':
        setLocale('enUS');
        setYupLocale(en);
        setDayJsLocale('en');
        break;
      case 'ru':
        setLocale('enUS');
        setYupLocale(en);
        setDayJsLocale('en');
        break;
      default:
        setLocale('enUS');
        setYupLocale(en);
        setDayJsLocale('en');
        break;
    }
  }

  useEffect(() => {
    const handleLanguageChange = () => {
      setAppLocale(i18n.language);
    };

    setAppLocale(i18n.language);
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <UserContextProvider>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={dayJsLocale}
        >
          <ThemeProvider theme={theme}>
            <Suspense fallback={<CircularProgress color="inherit" />}>
              <CssBaseline />
              <LoadingProvider>
                <SnackbarProvider>{children}</SnackbarProvider>
              </LoadingProvider>
            </Suspense>
          </ThemeProvider>
        </LocalizationProvider>
      </UserContextProvider>
    </ColorModeContext.Provider>
  );
};

export default MyFinThemeProvider;
