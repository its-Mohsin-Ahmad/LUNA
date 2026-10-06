'use client';

/* ------------------------------------------------------------------ */
/* Form controls with consistent validation affordances                */
/* ------------------------------------------------------------------ */

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { AlertCircle, Check, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const FIELD_BASE =
  'w-full rounded-md border bg-white px-3.5 text-sm text-ink placeholder:text-muted/70 ' +
  'transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15 ' +
  'disabled:cursor-not-allowed disabled:bg-mist disabled:text-muted';

function fieldTone(error?: string) {
  return error
    ? 'border-sale focus:border-sale focus:ring-sale/15'
    : 'border-line hover:border-forest/40';
}

export interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  /** Alias for `className`, kept for form-field call sites. */
  containerClassName?: string;
  children?: ReactNode;
}

export function Field({
  label,
  error,
  hint,
  required,
  className,
  containerClassName,
  children,
}: FieldProps) {
  return (
    <div className={cn('space-y-1.5', containerClassName ?? className)}>
      {label && (
        <label className="block text-[13px] font-semibold text-ink">
          {label}
          {required && (
            <span className="ml-0.5 text-sale" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-xs font-medium text-sale" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, icon, trailing, className, containerClassName, required, ...rest },
  ref
) {
  const id = useId();
  return (
    <Field label={label} error={error} hint={hint} required={required} className={containerClassName}>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          className={cn(FIELD_BASE, fieldTone(error), 'h-11', icon ? 'pl-10' : '', trailing ? 'pr-11' : '', className)}
          {...rest}
        />
        {trailing && <span className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</span>}
      </div>
    </Field>
  );
});

const STRENGTH_COLORS = ['bg-sale', 'bg-sale', 'bg-gold', 'bg-forest-400', 'bg-forest'] as const;
const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;

function passwordScore(value: string): number {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value) || value.length >= 14) score++;
  return score;
}

export function PasswordInput({
  label,
  error,
  hint,
  className,
  containerClassName,
  required,
  strength,
  ...rest
}: Omit<InputProps, 'type'> & { strength?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [internal, setInternal] = useState('');
  // Supports both uncontrolled use (internal state) and controlled use (value + onChange).
  const value = rest.value !== undefined ? String(rest.value) : internal;
  const score = passwordScore(value);

  return (
    <Field
      label={label}
      error={error}
      hint={strength && value ? undefined : hint}
      required={required}
      className={containerClassName}
    >
      <div className="relative">
        <input
          {...rest}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          value={value}
          onChange={(e) => {
            if (rest.value === undefined) setInternal(e.target.value);
            rest.onChange?.(e);
          }}
          className={cn(FIELD_BASE, fieldTone(error), 'h-11 pr-11', className)}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded text-muted transition hover:bg-cream hover:text-ink"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {strength && value.length > 0 && (
        <div className="flex items-center gap-2 pt-1">
          <div className="flex flex-1 gap-1" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn('h-1 flex-1 rounded-full transition-colors', i < score ? STRENGTH_COLORS[score] : 'bg-line')}
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-muted">{STRENGTH_LABELS[score]}</span>
        </div>
      )}
    </Field>
  );
}
export function Select({
  label,
  error,
  hint,
  options,
  className,
  containerClassName,
  required,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={containerClassName}>
      <div className="relative">
        <select
          aria-invalid={Boolean(error)}
          className={cn(FIELD_BASE, fieldTone(error), 'h-11 cursor-pointer appearance-none pr-10', className)}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>
    </Field>
  );
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}>(function Textarea({ label, error, hint, className, containerClassName, required, ...rest }, ref) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={containerClassName}>
      <textarea
        ref={ref}
        aria-invalid={Boolean(error)}
        className={cn(FIELD_BASE, fieldTone(error), 'min-h-28 py-2.5 leading-relaxed', className)}
        {...rest}
      />
    </Field>
  );
});

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-2.5 select-none', disabled && 'opacity-60', className)}>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            'grid h-[18px] w-[18px] place-items-center rounded border transition',
            checked ? 'border-forest bg-forest text-white' : 'border-line bg-white',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-forest/25 peer-focus-visible:ring-offset-2'
          )}
        >
          {checked && <Check className="h-3 w-3" strokeWidth={3.5} />}
        </span>
      </span>
      <span className="space-y-0.5">
        <span className="block text-sm text-ink">{label}</span>
        {description && <span className="block text-xs text-muted">{description}</span>}
      </span>
    </label>
  );
}

export function RadioCard({
  checked,
  onSelect,
  title,
  description,
  icon,
  className,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition',
        checked ? 'border-forest bg-cream/60 ring-1 ring-forest/20' : 'border-line bg-white hover:border-forest/40',
        className
      )}
    >
      {icon && (
        <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', checked ? 'bg-forest text-white' : 'bg-cream text-forest')}>
          {icon}
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-muted">{description}</span>}
      </span>
    </button>
  );
}