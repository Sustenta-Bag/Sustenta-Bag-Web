import * as Dialog from "@radix-ui/react-dialog";
import React, { ReactNode } from "react";

interface ModalComponentProps {
  triggerButton?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  triggerButton,
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  maxWidth = "max-w-md",
}) => {
  // Verifica se o modal é controlado externamente ou internamente
  const isControlled = isOpen !== undefined && onOpenChange !== undefined;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && (
        <Dialog.Trigger asChild>{triggerButton}</Dialog.Trigger>
      )}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content
          className={`fixed z-50 left-1/2 top-1/2 ${maxWidth} w-full -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-lg`}
        >
          <div className="flex justify-between items-start">
            <Dialog.Title className="text-lg font-semibold">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <i className="bx bx-x text-xl"></i>
              </button>
            </Dialog.Close>
          </div>
          <div className="mt-4">{children}</div>
          {footer && (
            <div className="mt-6 flex justify-end space-x-2">{footer}</div>
          )}
          {!footer && (
            <div className="mt-6 flex justify-end">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                  Fechar
                </button>
              </Dialog.Close>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ModalComponent;
