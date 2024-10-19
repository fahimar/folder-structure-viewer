import React from "react";
import Modal from "react-modal";

interface DeleteFolderModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onDeleteFolder: (folderId: string) => void;
  folderName: string;
  folderId: string;
}

const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
  isOpen,
  onRequestClose,
  onDeleteFolder,
  folderName,
  folderId,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex justify-center items-center h-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-lg font-semibold mb-6 text-center">
          Delete <span className="font-bold">"{folderName}"</span>?{" "}
          {/* Show folder name */}
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 rounded border border-gray-400 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onDeleteFolder}
            className="px-4 py-2 rounded border border-red-500 text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteFolderModal;
