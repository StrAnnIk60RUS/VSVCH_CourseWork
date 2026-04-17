export const STORAGE_KEYS = {
  token: 'vsvh:token',
  catalogFilters: 'vsvh:catalogFilters',
  catalogSort: 'vsvh:catalogSort',
  catalogPage: 'vsvh:catalogPage',
} as const;

export function clearAppStorage() {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith('vsvh:')) {
      localStorage.removeItem(key);
    }
  });
}
