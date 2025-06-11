import { useEffect, useRef } from 'react'

/**
 * Hook that handles closing modals when clicking outside or pressing Escape
 * @param isOpen - Whether the modal is open
 * @param onClose - Function to call when closing the modal
 * @returns ref - Ref to attach to the modal content element
 */
export const useModalClose = (isOpen: boolean, onClose: () => void) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    // Handle click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return modalRef
}