'use client';

/* ------------------------------------------------------------------ */
/* Toast notifications                                                 */
/* ------------------------------------------------------------------ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { uid } from '../utils';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'error' | 'info' | 'cart';
  action?: { label: string; href: string };
  image?: string;
}

type ToastAction = { type: 'ADD'; toast: Toast } | { type: 'REMOVE'; id: string };

function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  if (action.type === 'ADD') return [...state.slice(-3), action.toast];
  return state.filter((t) => t.id !== action.id);
}

export interface ToastApi {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id });
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = uid('toast');
      dispatch({ type: 'ADD', toast: { ...toast, id } });
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), 4000)
      );
    },
    [dismiss]
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => clearTimeout(t));
  }, []);

  const value = useMemo<ToastApi>(
    () => ({
      toasts,
      push,
      dismiss,
      success: (title, description) => push({ title, description, variant: 'success' }),
      error: (title, description) => push({ title, description, variant: 'error' }),
      info: (title, description) => push({ title, description, variant: 'info' }),
    }),
    [toasts, push, dismiss]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}