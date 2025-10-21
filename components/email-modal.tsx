'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: () => void
  to: string
  onToChange: (value: string) => void
  subject: string
  onSubjectChange: (value: string) => void
  message: string
  onMessageChange: (value: string) => void
}

export function EmailModal({
  isOpen,
  onClose,
  onSend,
  to,
  onToChange,
  subject,
  onSubjectChange,
  message,
  onMessageChange,
}: EmailModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!mounted || !isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Send Email</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close email modal"
            onClick={onClose}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <form
          className="space-y-4 px-6 py-5"
          onSubmit={(event) => {
            event.preventDefault()
            onSend()
          }}
        >
          <div className="space-y-1.5">
            <label htmlFor="email-to" className="text-sm font-medium text-gray-700">
              To
            </label>
            <Input
              id="email-to"
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(event) => onToChange(event.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email-subject" className="text-sm font-medium text-gray-700">
              Subject
            </label>
            <Input
              id="email-subject"
              type="text"
              value={subject}
              onChange={(event) => onSubjectChange(event.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email-message" className="text-sm font-medium text-gray-700">
              Message
            </label>
            <Textarea
              id="email-message"
              placeholder="Write your message here"
              value={message}
              onChange={(event) => onMessageChange(event.target.value)}
              rows={6}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Send Email</Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

