import * as React from "react";
import { Camera, X, ImagePlus } from "lucide-react";
import { readFileAsDataUrl } from "@/lib/utils";
import { toast } from "sonner";

interface BillPhotoUploadProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
}

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

export function BillPhotoUpload({ value, onChange }: BillPhotoUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Image is too large. Please choose one under 4MB.");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    onChange(dataUrl);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="relative w-fit">
          <img
            src={value}
            alt="Bill"
            className="h-36 w-36 rounded-xl border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-danger text-white shadow-glass-sm"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-gold-500/50 hover:text-gold-400"
        >
          <div className="flex items-center gap-1">
            <Camera className="h-5 w-5" />
            <ImagePlus className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-medium">Upload bill</span>
        </button>
      )}
    </div>
  );
}
