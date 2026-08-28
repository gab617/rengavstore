import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = ["50%", "90%"],
  className = "",
}) {
  const contentRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const snapIndex = useRef(1);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    snapIndex.current = 1;
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleTouchStart = (e) => {
    if (e.target.closest("[data-bottom-sheet-handle]")) return;
    const handle = contentRef.current?.querySelector("[data-bottom-sheet-handle]");
    if (handle && e.target === handle) return;
    if (e.touches.length !== 1) return;
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
    contentRef.current.style.transition = "none";
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const y = e.touches[0].clientY;
    const delta = y - startY.current;
    if (delta > 0) {
      currentY.current = delta;
      contentRef.current.style.transform = `translateY(${delta}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    contentRef.current.style.transition = "transform 300ms cubic-bezier(0.34,1.56,0.64,1)";
    if (currentY.current > 80) {
      onClose();
    } else {
      contentRef.current.style.transform = "translateY(0)";
    }
    currentY.current = 0;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col" onClick={onClose}>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        className="relative flex-1 flex flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl transition-transform"
        style={{ transform: "translateY(0)" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          data-bottom-sheet-handle
          className="flex shrink-0 items-center justify-center gap-2 px-4 py-3 border-b border-gray-100"
        >
          <div className="h-1 w-10 rounded-full bg-gray-300" />
          {title && (
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}