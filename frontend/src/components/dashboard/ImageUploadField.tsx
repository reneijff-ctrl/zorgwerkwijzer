'use client';

import { useRef, useState } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  currentUrl: string | null | undefined;
  onUpload: (file: File) => Promise<{ success: boolean; error?: string }>;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
  accept?: string;
  maxSizeMB?: number;
  aspectHint?: string;
  previewClassName?: string;
}

export default function ImageUploadField({
  label,
  currentUrl,
  onUpload,
  onDelete,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5,
  aspectHint,
  previewClassName = 'h-24 w-auto',
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const displayUrl = previewUrl ?? currentUrl ?? null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Bestand is te groot. Maximum is ${maxSizeMB} MB.`);
      return;
    }

    // Lokale preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setUploading(true);
    const result = await onUpload(file);
    setUploading(false);

    if (!result.success) {
      setError(result.error ?? 'Upload mislukt.');
      setPreviewUrl(null);
      URL.revokeObjectURL(objectUrl);
    }

    // Reset input zodat hetzelfde bestand opnieuw gekozen kan worden
    if (inputRef.current) inputRef.current.value = '';
  }

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    const result = await onDelete();
    setDeleting(false);
    if (result.success) {
      setPreviewUrl(null);
    } else {
      setError(result.error ?? 'Verwijderen mislukt.');
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>

      {displayUrl ? (
        <div className="flex items-start gap-3">
          <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt={label}
              className={`${previewClassName} object-contain rounded-lg`}
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
                <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading || deleting}
              className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              Vervangen
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={uploading || deleting}
              className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
              Verwijderen
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-xl py-8 px-4 hover:border-sky-400 hover:bg-sky-50 transition-colors disabled:opacity-50 group"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-2" />
          ) : (
            <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-sky-400 mb-2 transition-colors" />
          )}
          <span className="text-sm font-medium text-slate-600 group-hover:text-sky-600 transition-colors">
            {uploading ? 'Uploaden...' : 'Klik om afbeelding te uploaden'}
          </span>
          <span className="text-xs text-slate-400 mt-1">
            JPG, PNG of WEBP · max {maxSizeMB} MB{aspectHint ? ` · ${aspectHint}` : ''}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
