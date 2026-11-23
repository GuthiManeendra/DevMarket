import { useEffect } from 'react'
import { PrimaryButton, SecondaryButton } from './Buttons'

function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onCancel?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      aria-modal="true"
      className="dm-confirm-overlay"
      onClick={onCancel}
      role="dialog"
    >
      <div
        className="dm-card dm-confirm-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="h5 text-white mb-2">{title}</h2>
        <p className="dm-muted mb-4">{message}</p>
        <div className="d-flex justify-content-end gap-2">
          <SecondaryButton onClick={onCancel} type="button">{cancelLabel}</SecondaryButton>
          <PrimaryButton onClick={onConfirm} type="button">{confirmLabel}</PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
