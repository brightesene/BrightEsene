import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import { StudioEseneEyebrow } from './Typography';

type FieldProps = { label: ReactNode; hint?: ReactNode; error?: ReactNode };

function Field({ id, label, hint, error, children }: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className="se-field">
      <label htmlFor={id}>
        <StudioEseneEyebrow>{label}</StudioEseneEyebrow>
      </label>
      {children}
      {error ? <span className="se-field__error">{error}</span> : hint && <span className="se-field__hint">{hint}</span>}
    </div>
  );
}

export function StudioEseneInput({ label, hint, error, id, ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field id={inputId} label={label} hint={hint} error={error}>
      <input id={inputId} className="se-input" aria-invalid={error ? true : undefined} {...rest} />
    </Field>
  );
}

export function StudioEseneSelect({
  label,
  hint,
  error,
  id,
  options,
  ...rest
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { options: Array<{ value: string; label: string }> }) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <Field id={selectId} label={label} hint={hint} error={error}>
      <select id={selectId} className="se-select" {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** A compact choice between a few peer options (e.g. Today / This week). */
export function StudioEseneSegmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="se-segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="se-segmented__option"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
