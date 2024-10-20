//AddFolderModal
import React, { useState } from "react";
import Modal from "react-modal";

interface AddFolderModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onAddFolder: (name: string, parentId: string) => void;
  parentId: string;
  folderName: string;
}

const AddFolderModal: React.FC<AddFolderModalProps> = ({
  isOpen,
  onRequestClose,
  onAddFolder,
  parentId,
  folderName,
}) => {
  const [newFolderName, setNewFolderName] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddFolder(newFolderName, parentId);
    setNewFolderName("");
    onRequestClose();
  };
  console.log("Parent ID:", parentId);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex justify-center items-center h-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-lg font-semibold mb-4">
          Add folder in <span className="font-bold">"{folderName}"</span>{" "}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="newFolderName" className="text-sm">
              Folder name
            </label>
            <input
              id="newFolderName"
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onRequestClose}
              className="px-4 py-2 rounded border border-gray-400 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddFolderModal;
