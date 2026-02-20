'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

/* ======================================================
   Types
====================================================== */

interface PublishConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e: React.SyntheticEvent) => Promise<void>;
  isPublishing: boolean;
}

/* ======================================================
   Component
====================================================== */

export default function PublishConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isPublishing,
}: PublishConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  /* ------------------- open / close sync ------------------- */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  /* ------------------- handlers ------------------- */
  const handleCancel = useCallback(() => {
    if (isPublishing) return;
    onClose();
  }, [isPublishing, onClose]);

  const handleConfirm = useCallback(async (e: React.SyntheticEvent) => {
    await onConfirm(e);
  }, [onConfirm]);

  /* ------------------- prevent manual close while publishing ------------------- */
  const handleDialogCancel = useCallback(
    (event: React.SyntheticEvent<HTMLDialogElement>) => {
      if (isPublishing) {
        event.preventDefault();
        return;
      }
      onClose();
    },
    [isPublishing, onClose]
  );

  /* ======================================================
     Render
  ====================================================== */

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleDialogCancel} // ESC key
      className="backdrop:bg-gray-900/80 rounded-sm w-4/6 md:w-2/6 p-0 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="p-4">

        <h3 className="text-3xl font-semibold text-gray-900 flex justify-start items-center gap-x-2"> <span><Image src={"/icons/exclamation-blue.svg"} width={20} height={20} alt='exclamation-icon' className='w-6' /></span>Publish Changes  </h3>
        <p className="text-sm mt-2">Do you want to publish these changes? It will appear in the marketplace listing</p>
        {/* Footer */}
        <div className=" flex items-center justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPublishing}
            className="px-4 py-2 border-1 border-[#002F70]/50 text-[#002F70] rounded-sm hover:bg-blue-900 hover:text-white transition-colors text-sm font-semibold"
          >
            Continue Editing
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPublishing}
            className="px-4 py-2 bg-[#002F70] text-white rounded-sm hover:bg-gray-600 transition-colors text-sm font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </dialog>
  );
}
