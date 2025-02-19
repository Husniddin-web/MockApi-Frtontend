import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { X, Minus, Square } from "lucide-react";

const DraggableModal = ({
  isOpen,
  onClose,
  title,
  children,
  initialPosition = { x: 100, y: 100 },
  zIndex = 50,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const modalRef = useRef(null);
  const titleBarRef = useRef(null);
  const mainElement = document.querySelector("main");

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && modalRef.current) {
        e.preventDefault();
        const newX = position.x + (e.clientX - dragStart.x);
        const newY = Math.max(64, position.y + (e.clientY - dragStart.y));

        setPosition({ x: newX, y: newY });
        setDragStart({ x: e.clientX, y: e.clientY });
      }

      if (isResizing && modalRef.current) {
        e.preventDefault();
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const maxHeight = window.innerHeight - position.y - 20;

        setSize((prev) => ({
          width: Math.max(400, prev.width + deltaX),
          height: Math.max(300, Math.min(maxHeight, prev.height + deltaY)),
        }));
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
        setIsDragging(false);
        setIsResizing(false);
        document.body.style.userSelect = "auto";
        document.body.style.cursor = "default";
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = isResizing ? "se-resize" : "move";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "auto";
      document.body.style.cursor = "default";
    };
  }, [isDragging, isResizing, dragStart, position]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleMouseDown = (e) => {
    if (titleBarRef.current?.contains(e.target)) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleModalClick = () => {
    if (modalRef.current) {
      const allModals = document.querySelectorAll(".draggable-modal");
      const maxZ = Array.from(allModals).reduce((max, modal) => {
        const z = parseInt(window.getComputedStyle(modal).zIndex) || 0;
        return Math.max(max, z);
      }, 0);
      modalRef.current.style.zIndex = maxZ + 1;
    }
  };

  if (!isOpen || !mainElement) return null;

  return createPortal(
    <div
      ref={modalRef}
      onClick={handleModalClick}
      className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden draggable-modal"
      style={{
        left: position.x,
        top: position.y,
        zIndex,
        width: isMinimized ? "300px" : `${size.width}px`,
        height: isMinimized ? "40px" : `${size.height}px`,
        transform: `scale(${isMinimized ? 0.8 : 1})`,
        transition: isMinimized
          ? "transform 0.2s, height 0.2s, width 0.2s"
          : "none",
      }}
    >
      {/* Title Bar */}
      <div
        ref={titleBarRef}
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 cursor-move select-none"
      >
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
          {title}
        </h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded transition-colors"
          >
            {isMinimized ? (
              <Square className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`${
          isMinimized ? "hidden" : "flex flex-col h-[calc(100%-40px)]"
        }`}
      >
        {children}
      </div>

      {/* Resize Handle */}
      {!isMinimized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${
              isDragging ? "#4B5563" : "#9CA3AF"
            } 50%)`,
          }}
        />
      )}
    </div>,
    mainElement
  );
};

DraggableModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  initialPosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  zIndex: PropTypes.number,
};

export default DraggableModal;
