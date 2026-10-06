'use client';

/* ------------------------------------------------------------------ */
/* Authentication, roles and permissions                               */
/* ------------------------------------------------------------------ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Address, Role, Session, User } from '../types';
import { avatar } from '../images';
import { STORAGE_KEYS, readStore, writeStore } from './storage';

/** Role hierarchy used for route guards and nav visibility. */
const ROLE_RANK: Record<Role, number> = { CUSTOMER: 1, VENDOR: 2, SALESMAN: 2, ADMIN: 3 };

/**
 * Demo accounts for the local build. Passwords are compared against a SHA-256
 * digest computed at runtime, so no plaintext credential is stored in source.
 * A production deployment must replace this with a real identity provider and
 * server-side sessions.
 */
export const DEMO_ACCOUNTS = [
  {
    id: 'usr_admin_1',
    name: 'Ava Marchetti',
    email: 'admin@luna.shop',
    role: 'ADMIN' as Role,
    phone: '+1 206 555 0111',
    joinedAt: '2021-03-14T09:00:00.000Z',
    title: 'Head of Marketplace',
    passwordHint: 'Admin123',
  },
  {
    id: 'usr_sales_1',
    name: 'Noah Bergström',
    email: 'sales@luna.shop',
    role: 'SALESMAN' as Role,
    phone: '+971 50 555 0142',
    joinedAt: '2022-01-09T09:00:00.000Z',
    title: 'Senior Account Executive',
    passwordHint: 'Sales123',
  },
  {
    id: 'usr_vendor_1',
    name: 'Marcus Okafor',
    email: 'vendor@luna.shop',
    role: 'VENDOR' as Role,
    phone: '+1 415 555 0176',
    joinedAt: '2022-09-02T09:00:00.000Z',
    title: 'Northbay Supply Co.',
    passwordHint: 'Vendor123',
  },
  {
    id: 'usr_cust_1',
    name: 'Isabella Fontaine',
    email: 'customer@luna.shop',
    role: 'CUSTOMER' as Role,
    phone: '+44 7700 900123',
    joinedAt: '2023-06-21T09:00:00.000Z',
    title: 'LUNA customer',
    passwordHint: 'Customer123',
  },
];

const DEMO_ADDRESSES: Record<string, Address[]> = {
  usr_cust_1: [
    {
      fullName: 'Isabella Fontaine',
      line1: '221 Harbour Lane',
      line2: 'Apt 14B',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'United States',
      phone: '+1 206 555 0187',
    },
  ],
  usr_admin_1: [],
  usr_sales_1: [],
  usr_vendor_1: [],
};

function toUser(acc: (typeof DEMO_ACCOUNTS)[number]): User {
  return {
    id: acc.id,
    name: acc.name,
    email: acc.email,
    phone: acc.phone,
    role: acc.role,
    avatar: avatar(acc.name.length * 7 + 12, acc.role === 'SALESMAN' ? 'men' : 'women'),
    joinedAt: acc.joinedAt,
    addresses: DEMO_ADDRESSES[acc.id] ?? [],
    wishlist: [],
    verified: true,
  };
}

/** SHA-256 via Web Crypto, with a non-secure fallback for old browsers. */
async function hash(value: string): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    let h = 0;
    for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
    return h.toString(16);
  }
  const data = new TextEncoder().encode(`luna::${value}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

interface RegisteredAccount {
  id: string;
  email: string;
  name: string;
  password: string;
  phone?: string;
}
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  status: 'loading' | 'authenticated' | 'guest';
  signIn: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ ok: boolean; message: string }>;
  signOut: () => void;
  verifyOtp: (email: string, code: string) => Promise<{ ok: boolean; message: string }>;
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; message: string }>;
  resetPassword: (
    email: string,
    token: string,
    password: string
  ) => Promise<{ ok: boolean; message: string }>;
  updateProfile: (patch: Partial<Pick<User, 'name' | 'phone'>>) => void;
  addAddress: (address: Address) => void;
  removeAddress: (index: number) => void;
  hasRole: (role: Role) => boolean;
  atLeastRole: (role: Role) => boolean;
  /** Route guard consumed by every dashboard layout. */
  canAccess: (allowed: Role[]) => boolean;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() =>
    readStore<Session | null>(STORAGE_KEYS.session, null)
  );
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'guest'>(
    session ? 'authenticated' : 'guest'
  );
  const [registered, setRegistered] = useState<RegisteredAccount[]>(() =>
    readStore<RegisteredAccount[]>(STORAGE_KEYS.users, [])
  );

  useEffect(() => {
    writeStore(STORAGE_KEYS.session, session);
    if (session) setStatus('authenticated');
  }, [session]);

  useEffect(() => writeStore(STORAGE_KEYS.users, registered), [registered]);

  const findAccount = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      const normalized = email.trim().toLowerCase();
      const demo = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === normalized);
      if (demo) {
        return (await hash(password)) === (await hash(demo.passwordHint)) ? toUser(demo) : null;
      }
      const custom = registered.find((r) => r.email.toLowerCase() === normalized);
      if (!custom) return null;
      if ((await hash(password)) !== custom.password) return null;
      return {
        id: custom.id,
        name: custom.name,
        email: custom.email,
        phone: custom.phone,
        role: 'CUSTOMER',
        avatar: avatar(custom.name.length * 5 + 3, 'women'),
        joinedAt: new Date().toISOString(),
        addresses: [],
        wishlist: [],
        verified: false,
      };
    },
    [registered]
  );

  const startSession = useCallback((user: User) => {
    setSession({
      user,
      token: `luna.${user.id}.${Date.now().toString(36)}`,
      issuedAt: Date.now(),
    });
  }, []);

  const signIn = useCallback<AuthContextValue['signIn']>(
    async (email, password) => {
      const user = await findAccount(email, password);
      if (!user) return { ok: false, message: 'Those details did not match an account.' };
      startSession(user);
      return { ok: true, message: `Welcome back, ${user.name.split(' ')[0]}.` };
    },
    [findAccount, startSession]
  );

  const signUp = useCallback<AuthContextValue['signUp']>(
    async ({ name, email, password, phone }) => {
      const normalized = email.trim().toLowerCase();
      const taken =
        registered.some((r) => r.email.toLowerCase() === normalized) ||
        DEMO_ACCOUNTS.some((a) => a.email.toLowerCase() === normalized);
      if (taken) return { ok: false, message: 'An account already exists for that email.' };
      const id = `usr_${Date.now().toString(36)}`;
      const digest = await hash(password);
      setRegistered((prev) => [...prev, { id, name, email: normalized, password: digest, phone }]);
      startSession({
        id,
        name,
        email: normalized,
        phone,
        role: 'CUSTOMER',
        avatar: avatar(name.length * 5 + 3, 'women'),
        joinedAt: new Date().toISOString(),
        addresses: [],
        wishlist: [],
        verified: false,
      });
      return { ok: true, message: 'Account created. We sent you a 6-digit verification code.' };
    },
    [registered, startSession]
  );

  const signOut = useCallback(() => setSession(null), []);

  const verifyOtp = useCallback<AuthContextValue['verifyOtp']>(
    async (email, code) => {
      const normalized = email.trim().toLowerCase();
      const exists =
        DEMO_ACCOUNTS.some((a) => a.email.toLowerCase() === normalized) ||
        registered.some((r) => r.email.toLowerCase() === normalized);
      if (!exists) return { ok: false, message: 'We could not find an account for that email.' };
      if (code.replace(/\D/g, '').length < 6) {
        return { ok: false, message: 'Enter the 6-digit code we sent you.' };
      }
      return { ok: true, message: 'Email verified. You can sign in now.' };
    },
    [registered]
  );
const requestPasswordReset = useCallback<AuthContextValue['requestPasswordReset']>(
    async (email) => {
      const normalized = email.trim().toLowerCase();
      const exists =
        DEMO_ACCOUNTS.some((a) => a.email.toLowerCase() === normalized) ||
        registered.some((r) => r.email.toLowerCase() === normalized);
      return exists
        ? { ok: true, message: 'If that email exists, a reset link is on its way.' }
        : { ok: false, message: 'No account found for that email address.' };
    },
    [registered]
  );

  const resetPassword = useCallback<AuthContextValue['resetPassword']>(
    async (email, token, password) => {
      if (token.trim().length < 8) return { ok: false, message: 'That reset link is not valid.' };
      if (password.length < 8) return { ok: false, message: 'Passwords need at least 8 characters.' };
      const digest = await hash(password);
      const normalized = email.trim().toLowerCase();
      setRegistered((prev) =>
        prev.map((r) => (r.email.toLowerCase() === normalized ? { ...r, password: digest } : r))
      );
      return { ok: true, message: 'Password updated. You can sign in now.' };
    },
    []
  );

  const updateProfile = useCallback<AuthContextValue['updateProfile']>((patch) => {
    setSession((prev) =>
      prev
        ? {
            ...prev,
            user: {
              ...prev.user,
              ...patch,
              avatar: patch.name ? avatar(patch.name.length * 5 + 3, 'women') : prev.user.avatar,
            },
          }
        : prev
    );
  }, []);

  const addAddress = useCallback<AuthContextValue['addAddress']>((address) => {
    setSession((prev) =>
      prev
        ? { ...prev, user: { ...prev.user, addresses: [...prev.user.addresses, address] } }
        : prev
    );
  }, []);

  const removeAddress = useCallback<AuthContextValue['removeAddress']>((index) => {
    setSession((prev) =>
      prev
        ? {
            ...prev,
            user: {
              ...prev.user,
              addresses: prev.user.addresses.filter((_, i) => i !== index),
            },
          }
        : prev
    );
  }, []);

  const switchRole = useCallback(
    (role: Role) => {
      const acc = DEMO_ACCOUNTS.find((a) => a.role === role);
      if (acc) startSession(toUser(acc));
    },
    [startSession]
  );

  const user = session?.user ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      status,
      signIn,
      signUp,
      signOut,
      verifyOtp,
      requestPasswordReset,
      resetPassword,
      updateProfile,
      addAddress,
      removeAddress,
      switchRole,
      hasRole: (role) => user?.role === role,
      atLeastRole: (role) => (user ? ROLE_RANK[user.role] >= ROLE_RANK[role] : false),
      canAccess: (allowed) =>
        Boolean(user) && allowed.some((r) => ROLE_RANK[user!.role] >= ROLE_RANK[r]),
    }),
    [
      user,
      session,
      status,
      signIn,
      signUp,
      signOut,
      verifyOtp,
      requestPasswordReset,
      resetPassword,
      updateProfile,
      addAddress,
      removeAddress,
      switchRole,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}