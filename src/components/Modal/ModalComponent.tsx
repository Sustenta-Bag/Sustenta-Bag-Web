import * as Dialog from "@radix-ui/react-dialog";
import React from "react";

interface ModalComponentProps {
  textButton: string;
  titleModal: string;
  textModal: string;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  textButton,
  titleModal,
  textModal,
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 transition">
          {textButton}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 max-w-md w-full -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <Dialog.Title className="text-lg font-semibold">
              {titleModal}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700"></button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-2 text-gray-600">
            {textModal}
          </Dialog.Description>
          <div className="mt-4 flex justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Fechar
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ModalComponent;
