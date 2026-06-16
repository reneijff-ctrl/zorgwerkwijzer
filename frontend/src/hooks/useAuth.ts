import { useAuthContext } from '@/context/AuthContext';

/**
 * Hook voor toegang tot de auth-context.
 * Gooit een fout als gebruikt buiten <AuthProvider>.
 */
export function useAuth() {
  return useAuthContext();
}
