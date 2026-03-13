import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TabooWordPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tabooWords: string[];
  onConfirm: (word: string) => void;
}

export function TabooWordPicker({ open, onOpenChange, tabooWords, onConfirm }: TabooWordPickerProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selected) {
      onConfirm(selected);
      setSelected(null);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelected(null);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl border-border bg-card p-4 shadow-lg sm:max-w-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base text-card-foreground">
            Which taboo word was spoken?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Select the word the clue giver said. This will subtract 1 point from their team.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-wrap gap-2 py-2">
          {tabooWords.map((word) => (
            <motion.button
              key={word}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setSelected(word)}
              className={`inline-flex min-h-[44px] shrink-0 touch-manipulation rounded-xl px-4 text-sm font-semibold transition-colors ${
                selected === word
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {word}
            </motion.button>
          ))}
        </div>

        <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
          <AlertDialogCancel onClick={handleCancel} className="m-0 min-h-[44px] touch-manipulation">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!selected}
            className="min-h-[44px] touch-manipulation bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            Report taboo
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
