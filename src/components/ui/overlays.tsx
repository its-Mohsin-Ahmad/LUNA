'use client';

/* ------------------------------------------------------------------ */
/* Overlays: Modal, Drawer, Accordion                                   */
/* ------------------------------------------------------------------ */

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Close on Escape and lock body scroll while an overlay is open. */
function useOverlayBehaviour(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  useOverlayBehaviour(open, onClose);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open || typeof document === 'undefined') return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 animate-fadeIn bg-ink/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-card-hover animate-scaleIn sm:rounded-2xl',
          widths[size]
        )}
      >
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 id={titleId} className="display text-lg text-forest">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-muted transition hover:bg-cream hover:text-ink"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </header>
        <div className="thin-scrollbar flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <footer className="border-t border-line bg-warm px-5 py-4">{footer}</footer>}
      </div>
    </div>,
    document.body
  );
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = 'right',
  width = 'max-w-md',
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: 'right' | 'left';
  width?: string;
  footer?: ReactNode;
}) {
  const titleId = useId();
  useOverlayBehaviour(open, onClose);
  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[95]">
      <div
        className="absolute inset-0 animate-fadeIn bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'absolute inset-y-0 flex w-full flex-col bg-white shadow-card-hover',
          width,
          side === 'right' ? 'right-0 animate-slideInRight' : 'left-0 animate-slideInLeft'
        )}
      >
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 id={titleId} className="display text-lg text-forest">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="grid h-9 w-9 place-items-center rounded-md text-muted transition hover:bg-cream hover:text-ink"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </header>
        <div className="thin-scrollbar flex-1 overflow-y-auto">{children}</div>
        {footer && <footer className="border-t border-line bg-warm px-5 py-4">{footer}</footer>}
      </aside>
    </div>,
    document.body
  );
}
export function Accordion({
  items,
  className,
  defaultOpen,
}: {
  items: Array<{ id: string; question: string; answer: ReactNode }>;
  className?: string;
  defaultOpen?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  return (
    <div
      className={cn(
        'divide-y divide-line overflow-hidden rounded-xl border border-line bg-white',
        className
      )}
    >
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-forest transition hover:bg-warm"
            >
              {item.question}
              <span
                aria-hidden
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cream text-forest transition-transform',
                  isOpen && 'rotate-45'
                )}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="animate-fadeUp px-5 pb-5 text-sm leading-relaxed text-muted">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}