import { useEffect, useRef } from "react";

interface LightboxProps {
  isOpen: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
  isPdf?: boolean;
}

export default function Lightbox({ isOpen, src, alt = "Image", onClose, isPdf = false }: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard events (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Lock scroll
      document.body.style.overflow = "hidden";
      // Focus the close button for accessibility
      closeButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore scroll
      if (isOpen) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose} // Close on background click
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      {/* Content */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] overflow-auto" 
        onClick={e => e.stopPropagation()} // Prevent closing when clicking on content
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          className="absolute right-2 top-2 z-10 rounded-full bg-black/40 p-1 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image or PDF */}
        {isPdf ? (
          <embed 
            src={src} 
            type="application/pdf"
            className="h-[85vh] w-[85vw] bg-white"
          />
        ) : (
          <img 
            src={src} 
            alt={alt} 
            className="max-h-[90vh] max-w-[90vw] object-contain" 
            id="lightbox-title"
          />
        )}
      </div>
    </div>
  );
}
