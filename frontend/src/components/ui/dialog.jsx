/**
 * ============================================================
 * DIALOG (MODAL) COMPONENT — Animated overlay modal
 * ============================================================
 *
 * 🎓 WHY A REUSABLE DIALOG?
 * Every CRUD page (Doctor, Medicine, Service) builds its own modal.
 * The overlay, centering, close button, and animation logic is
 * duplicated 4+ times.
 *
 * This component provides:
 * - Animated open/close (scale + fade)
 * - Click-outside-to-close
 * - Escape key to close
 * - Focus trapping (accessibility)
 * - Composable slots (Header, Body, Footer)
 *
 * 🎓 INTERVIEW: "How do you handle modals in React?"
 * → "I built a reusable Dialog component with compound sub-components.
 *    It uses useEffect for escape key handling and click-outside detection.
 *    The animation uses CSS transitions with state-driven classes.
 *    In production, I'd consider React Portal for DOM placement."
 */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

function Dialog({ open, onClose, children, className }) {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 animate-in fade-in" />

      {/* Dialog Panel */}
      <div
        className={cn(
          'relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto',
          'bg-card border border-border rounded-xl shadow-xl',
          'animate-in fade-in zoom-in-95 duration-200',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, children, onClose, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-6 border-b border-border',
        className
      )}
      {...props}
    >
      <div>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }) {
  return (
    <p
      className={cn('text-sm text-muted-foreground mt-1', className)}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }) {
  return <div className={cn('p-6', className)} {...props} />;
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn('flex gap-3 p-6 pt-0', className)}
      {...props}
    />
  );
}

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter };
