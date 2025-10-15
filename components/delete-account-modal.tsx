"use client"

import { X } from "lucide-react"

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center space-y-6">
          <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
            Are You Sure? We're very sad to see you leave. Unless you perfected your deen already, don't leave us
            forever.
          </h2>

          <p className="text-base font-medium text-gray-900">Salam, sister or brother.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={onConfirm}
              className="px-8 py-3 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition-colors"
            >
              Yes, delete forever.
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-300 text-gray-900 rounded-full font-medium hover:bg-gray-400 transition-colors"
            >
              I haven't perfected my deen yet.
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
