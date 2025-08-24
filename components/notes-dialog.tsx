"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getUserNotes, saveUserNote } from "@/lib/storage"

interface NotesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deckId: string
  cardIndex: number
}

export function NotesDialog({ open, onOpenChange, deckId, cardIndex }: NotesDialogProps) {
  const [note, setNote] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (open) {
      // Load existing note when dialog opens
      const notes = getUserNotes()
      const existingNote = notes.find((n) => n.deckId === deckId && n.cardIndex === cardIndex)
      setNote(existingNote?.note || "")
      setSaved(false)
    }
  }, [open, deckId, cardIndex])

  const handleSave = () => {
    saveUserNote(deckId, cardIndex, note)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Card Notes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note">Your private note for this card:</Label>
            <Textarea
              id="note"
              placeholder="Add your thoughts, insights, or reminders about this card..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex justify-between items-center">
            <div>{saved && <span className="text-sm text-green-600 dark:text-green-400">✓ Note saved</span>}</div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Note</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
