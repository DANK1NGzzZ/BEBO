import WebApp from '@twa-dev/sdk';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { useEffect } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { routes } from '@/navigation/routes.jsx';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

function BackButtonManipulator() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function onClick() {
      navigate(-1);
    }
    WebApp.BackButton.onClick(onClick);

    return () => WebApp.BackButton.offClick(onClick);
  }, [navigate]);

  useEffect(() => {
    if (location.pathname === '/') {
      WebApp.BackButton.isVisible && WebApp.BackButton.hide();
    } else {
      !WebApp.BackButton.isVisible && WebApp.BackButton.show();
    }
  }, [location]);

  return null;
}

/**
 * @return {JSX.Element}
 */
export function App() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://bebo-seven.vercel.app/tonconnect-manifest.json"
    >
      <AppRoot
        appearance={WebApp.colorScheme}
        platform={['macos', 'ios'].includes(WebApp.platform) ? 'ios' : 'base'}
      >
        <BrowserRouter>
          <BackButtonManipulator />
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={<route.Component />} />
            ))}
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </BrowserRouter>
      </AppRoot>
    </TonConnectUIProvider>
  );
}
