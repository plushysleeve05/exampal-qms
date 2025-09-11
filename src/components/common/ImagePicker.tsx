import { useMemo, useState, useRef, useEffect } from "react";

export type ImagePickerProps = {
  /**
   * Optional label for the file input
   */
  label?: string;
  /**
   * The file object (if any)
   */
  file?: File | null;
  /**
   * URL for preview image or PDF
   */
  previewUrl?: string | null;
  /**
   * Callback when file selection changes
   * @param file - The selected file or null if cleared
   * @param previewUrl - Preview URL for the selected file (if any)
   */
  onChange: (file: File | null, previewUrl?: string | null) => void;
  /**
   * File types to accept (e.g., "image/*", "image/png,image/jpeg", etc.)
   * @default "image/*"
   */
  accept?: string;
  /**
   * Size variant for the component
   * @default "compact"
   */
  variant?: "compact" | "medium" | "tall";
  /**
   * Whether to show the clear button
   * @default true
   */
  showClear?: boolean;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Callback when thumbnail is clicked (for preview/lightbox)
   */
  onThumbClick?: () => void;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Maximum file size in bytes
   * @default 10485760 (10MB)
   */
  maxSize?: number;
  /**
   * Whether the input is required
   * @default false
   */
  required?: boolean;
};

export default function ImagePicker({
  label,
  file,
  previewUrl,
  onChange,
  accept = "image/*",
  variant = "compact",
  showClear = true,
  className = "",
  onThumbClick,
  error,
  disabled = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  required = false
}: ImagePickerProps) {
  const id = useMemo(() => `file-upload-${Math.random().toString(36).slice(2)}`, []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasImage = !!(file || previewUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Determine height based on variant
  const heightClass = {
    compact: "h-[36px]",
    medium: "h-[60px]",
    tall: "h-[90px]"
  }[variant];

  // For PDFs, extract filename to display
  const isPdf = file?.type === "application/pdf" || previewUrl?.endsWith(".pdf");
  const fileName = file?.name || previewUrl?.split("/").pop() || "";

  // Handle file change
  const handleFileChange = (newFile: File | null) => {
    // Clear any previous errors
    setLocalError(null);
    
    // Revoke old URL if replacing
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!newFile) {
      onChange(null, null);
      return;
    }

    // Validate file size
    if (newFile.size > maxSize) {
      setLocalError(`File size exceeds ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`);
      return;
    }

    // Show loading state while processing
    setIsLoading(true);
    
    try {
      // Create preview URL for the new file
      const url = URL.createObjectURL(newFile);
      onChange(newFile, url);
    } catch (err) {
      setLocalError('Failed to process file');
      console.error('File processing error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.length) {
      handleFileChange(files[0]);
    }
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the click to browse files
    handleFileChange(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Revoke any blob URLs to prevent memory leaks when component is unmounted
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Combine external and internal errors
  const displayError = error || localError;
  const isDisabled = disabled || isLoading;

  return (
    <div className={`space-y-1 ${className}`} data-testid="image-picker">
      {label && (
        <label 
          htmlFor={id} 
          className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div
        className={`relative border ${hasImage ? 'border-solid' : 'border-dashed'} rounded-md p-1 ${
          displayError ? 'border-red-500 dark:border-red-500' : 'dark:border-gray-600'
        } ${heightClass} w-full flex items-center justify-center bg-white dark:bg-gray-700 overflow-hidden transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
        } ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
        onDragEnter={isDisabled ? undefined : handleDragEnter}
        onDragLeave={isDisabled ? undefined : handleDragLeave}
        onDragOver={isDisabled ? undefined : handleDragOver}
        onDrop={isDisabled ? undefined : handleDrop}
        aria-invalid={!!displayError}
        aria-describedby={displayError ? `${id}-error` : undefined}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-700/80 z-10">
            <div className="w-5 h-5 border-2 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {hasImage ? (
          // If we have an image/file, render the preview with the onClick handler for the lightbox
          <div 
            className={`w-full h-full flex items-center justify-center group ${isDisabled ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-600/30'}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onThumbClick && !isDisabled) onThumbClick();
            }}
            role={onThumbClick && !isDisabled ? "button" : undefined}
            tabIndex={onThumbClick && !isDisabled ? 0 : undefined}
            onKeyDown={
              onThumbClick && !isDisabled
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onThumbClick();
                    }
                  }
                : undefined
            }
            style={{ cursor: onThumbClick && !isDisabled ? "pointer" : isDisabled ? "not-allowed" : "default" }}
            aria-label={onThumbClick && !isDisabled ? "View full image" : undefined}
          >
            {isPdf ? (
              <div className="flex flex-col items-center justify-center text-center">
                <svg
                  className="h-4 w-4 text-red-500 mb-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 16L7 10H17L12 16Z" />
                  <path
                    fillRule="evenodd"
                    d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm2 3a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H8a1 1 0 01-1-1V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[9px] text-gray-700 dark:text-gray-300 truncate max-w-full px-1">
                  {fileName || "PDF"}
                </span>
                {onThumbClick && !isDisabled && (
                  <span className="text-[8px] text-blue-600 dark:text-blue-400 opacity-80 group-hover:opacity-100">View</span>
                )}
              </div>
            ) : (
              <>
                <img
                  src={previewUrl || ""}
                  alt={label || "Preview"}
                  className="h-full max-w-full object-cover object-center"
                />
                {onThumbClick && !isDisabled && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] bg-black/50 text-white px-1.5 py-0.5 rounded">View</span>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          // Only show input when there is no image
          <>
            <div className="text-center text-[10px] text-gray-500 dark:text-gray-300 px-1">
              <svg
                className="mx-auto h-4 w-4 mb-0.5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {accept === "image/*" ? (
                <span>Drop image or click to upload</span>
              ) : accept.includes("pdf") ? (
                <span>Drop PDF or click to upload</span>
              ) : (
                <span>Drop file or click to upload</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              id={id}
              type="file"
              accept={accept}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                handleFileChange(f);
                // Clear the input so the same file can be selected again if needed
                e.target.value = "";
              }}
              aria-label={label || "Upload file"}
              aria-invalid={!!displayError}
              aria-describedby={displayError ? `${id}-error` : undefined}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              required={required}
              aria-required={required}
              data-testid="file-input"
            />
          </>
        )}
      </div>

      {/* Error message */}
      {displayError && (
        <div 
          className="text-xs text-red-500 mt-1" 
          id={`${id}-error`}
          data-testid="image-picker-error"
        >
          {displayError}
        </div>
      )}

      {/* Buttons for replace/clear */}
      {(hasImage || showClear) && (
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={hasImage ? () => {
              if (isDisabled) return;
              
              // Create a temporary input for replacing
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = accept;
              input.addEventListener('change', (e) => {
                const file = (e.target as HTMLInputElement).files?.[0] ?? null;
                handleFileChange(file);
              });
              input.click();
            } : () => {
              if (isDisabled) return;
              fileInputRef.current?.click();
            }}
            className={`inline-flex items-center justify-center px-2 py-1 text-xs rounded-md 
              ${isDisabled 
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300 cursor-pointer dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500'
              }`}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            data-testid={hasImage ? "replace-button" : "upload-button"}
          >
            {hasImage ? (
              <>
                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Replace
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                  <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                </svg>
                Upload
              </>
            )}
          </button>
          
          {hasImage && showClear && (
            <button
              type="button"
              onClick={isDisabled ? undefined : handleClear}
              className={`inline-flex items-center px-2 py-1 text-xs rounded-md 
                ${isDisabled
                  ? 'bg-red-50/50 text-red-400 dark:bg-red-900/20 dark:text-red-400/50 cursor-not-allowed'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 focus:outline-none focus:ring-1 focus:ring-red-500'
                }`}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              data-testid="clear-button"
            >
              <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Clear
            </button>
          )}
          
          {hasImage && file && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
              {(file.size / 1024).toFixed(0)}KB
            </span>
          )}
        </div>
      )}
    </div>
  );
}
