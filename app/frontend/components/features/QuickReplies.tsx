"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export interface QuickReply {
  text: string;
  value: string;
}

interface QuickRepliesProps {
  options: QuickReply[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export default function QuickReplies({ options, onSelect, disabled = false }: QuickRepliesProps) {
  const [selected, setSelected] = useState(false);

  const handleSelect = (value: string) => {
    if (disabled || selected) return;

    setSelected(true);
    onSelect(value);
  };

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide">
      {options.map((option) => (
        <Button
          key={option.value}
          variant="secondary"
          size="sm"
          onClick={() => handleSelect(option.value)}
          disabled={disabled || selected}
          className="whitespace-nowrap flex-shrink-0"
        >
          {option.text}
        </Button>
      ))}
    </div>
  );
}
