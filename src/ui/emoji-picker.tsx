'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover'
import EmojiPickerDefault, { EmojiClickData, Theme } from 'emoji-picker-react'
import { useState } from 'react'

interface EmojiPickerProps {
  onChange?: (emoji: string) => void
  children?: React.ReactNode
  theme?: Theme
  className?: string
  disabled?: boolean
}

export function EmojiPicker({
  onChange,
  children,
  theme = Theme.AUTO,
}: EmojiPickerProps) {
  const [open, setOpen] = useState(false)

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    console.log('Emoji clicked:', emojiData.emoji)
    onChange?.(emojiData.emoji)
    setOpen(false) // Close popover after selecting emoji
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto border-0 p-0 shadow-lg" align="start">
        <EmojiPickerDefault
          onEmojiClick={handleEmojiClick}
          theme={theme}
          lazyLoadEmojis
          searchDisabled={false}
          skinTonesDisabled={false}
          previewConfig={{
            defaultEmoji: '1f60a',
            defaultCaption: 'What is your mood?',
            showPreview: true,
          }}
          height={400}
          width={300}
        />
      </PopoverContent>
    </Popover>
  )
}