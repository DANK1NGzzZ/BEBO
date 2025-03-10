
import { useEffect, useMemo } from 'react';
import WebApp from '@twa-dev/sdk';

import { App } from '@/components/App.jsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.jsx';

/**
 * @param {unknown} error
 * @returns {JSX.Element}
 */
function ErrorBoundaryError({ error }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

/**
 * @returns {JSX.Element}
 */
export function Inner() {
  const debug = WebApp.initDataUnsafe.start_param === 'debug';
  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (debug) {
      import('eruda').then((lib) => lib.default.init());
    }
  }, [debug]);

  return (
      <App/>
  );
}

/**
 * @returns {JSX.Element}
 */
export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <Inner/>
    </ErrorBoundary>
  );
}
