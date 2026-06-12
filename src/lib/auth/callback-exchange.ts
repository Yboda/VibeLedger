type ExchangeResult = { error: Error | null };

const STORAGE_PREFIX = 'auth-callback:';
const inFlightExchanges = new Map<string, Promise<ExchangeResult>>();

function getStorageKey(code: string) {
  return `${STORAGE_PREFIX}${code}`;
}

async function waitForPendingExchange(
  waitForSession: () => Promise<boolean>
): Promise<ExchangeResult> {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (await waitForSession()) {
      return { error: null };
    }

    await new Promise(resolve => {
      window.setTimeout(resolve, 100);
    });
  }

  return {
    error: new Error('Auth callback timed out while waiting for session'),
  };
}

export async function exchangeAuthCodeOnce(
  code: string,
  exchange: () => Promise<ExchangeResult>,
  waitForSession: () => Promise<boolean>
): Promise<ExchangeResult> {
  const inFlight = inFlightExchanges.get(code);
  if (inFlight) {
    return inFlight;
  }

  const storageKey = getStorageKey(code);

  const runExchange = async (): Promise<ExchangeResult> => {
    if (typeof window !== 'undefined') {
      const status = sessionStorage.getItem(storageKey);

      if (status === 'done') {
        return { error: null };
      }

      if (status === 'pending') {
        return waitForPendingExchange(waitForSession);
      }

      sessionStorage.setItem(storageKey, 'pending');
    }

    const result = await exchange();

    if (typeof window !== 'undefined') {
      if (result.error) {
        const hasSession = await waitForSession();
        if (hasSession) {
          sessionStorage.setItem(storageKey, 'done');
          return { error: null };
        }
        sessionStorage.removeItem(storageKey);
      } else {
        sessionStorage.setItem(storageKey, 'done');
      }
    }

    return result;
  };

  const promise = runExchange().finally(() => {
    inFlightExchanges.delete(code);
  });

  inFlightExchanges.set(code, promise);
  return promise;
}
