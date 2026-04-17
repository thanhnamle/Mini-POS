const memoryStore = new Map<string, string>();

function getWebStorage(): Storage | null {
  if (typeof globalThis === 'undefined') {
    return null;
  }

  try {
    return 'localStorage' in globalThis ? globalThis.localStorage : null;
  } catch {
    return null;
  }
}

export async function getItem(key: string): Promise<string | null> {
  const webStorage = getWebStorage();

  if (webStorage) {
    return webStorage.getItem(key);
  }

  return memoryStore.has(key) ? memoryStore.get(key) ?? null : null;
}

export async function setItem(key: string, value: string): Promise<void> {
  const webStorage = getWebStorage();

  if (webStorage) {
    webStorage.setItem(key, value);
    return;
  }

  memoryStore.set(key, value);
}

export async function removeItem(key: string): Promise<void> {
  const webStorage = getWebStorage();

  if (webStorage) {
    webStorage.removeItem(key);
    return;
  }

  memoryStore.delete(key);
}
