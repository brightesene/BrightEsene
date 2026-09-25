import { useEffect, useId, type ReactNode } from 'react';
import { StudioEseneEyebrow, StudioEseneTitle } from './Typography';

type Props = {
  open: boolean;
  onClose: () => void;
  eyebrow?: ReactNode;
  title: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
};

/** Bottom sheet on phones, centred panel on larger screens. */
export function StudioEseneModal({ open, onClose, eyebrow, title, children, actions }: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="se-modal" onClick={onClose}>
      <div
        className="se-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="se-modal__head">
          <div className="se-stack se-gap-2">
            {eyebrow && <StudioEseneEyebrow>{eyebrow}</StudioEseneEyebrow>}
            <StudioEseneTitle size="lg">
              <span id={titleId}>{title}</span>
            </StudioEseneTitle>
          </div>
          <button type="button" className="se-modal__close" onClick={onClose} autoFocus>
            Close
          </button>
        </div>
        {children}
        {actions && <div className="se-modal__actions">{actions}</div>}
      </div>
    </div>
  );
}
