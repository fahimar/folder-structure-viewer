import React, { useState } from "react";
import DeleteFolderModal from "./DeleteFolderModel";

interface Folder {
  id: string;
  name: string;
  children?: Folder[];
}

interface TreeViewProps {
  folder: Folder;
  onAddFolder: (parentId: string) => void;
  onDeleteFolder: (folderId: string, folderName: string) => void;
  error?: string;
}

const TreeView: React.FC<TreeViewProps> = ({
  folder,
  onAddFolder,
  onDeleteFolder,
  error,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    undefined
  );
  const [selectedFolderName, setSelectedFolderName] = useState<
    string | undefined
  >(undefined);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleOpenDeleteModal = (folderId: string, folderName: string) => {
    setSelectedFolderId(folderId);
    setSelectedFolderName(folderName);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedFolderId(undefined);
    setSelectedFolderName(undefined);
  };

  // Call the onDeleteFolder method in parent with selectedFolderId
  const handleDeleteFolder = () => {
    if (selectedFolderId) {
      onDeleteFolder(selectedFolderId, selectedFolderName || "");
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="pl-4">
      <div className="flex items-center gap-x-10 space-y-2">
        <span className="cursor-pointer" onClick={toggleExpand}>
          {isExpanded ? "▼" : "▶"} {folder.name}
        </span>
        {folder.id !== "root" && (
          <button
            className="bg-red-500 text-white px-2 py-1 rounded-full"
            onClick={() => handleOpenDeleteModal(folder.id, folder.name)}
          >
            X
          </button>
        )}
        <div className="flex flex-col items-start gap-y-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => onAddFolder(folder.id)}
          >
            + New
          </button>
        </div>
      </div>

      {isExpanded && folder.children && folder.children.length > 0 ? (
        <div className="pl-4">
          {folder.children.map((child) => (
            <TreeView
              key={child.id}
              folder={child}
              onAddFolder={onAddFolder}
              onDeleteFolder={onDeleteFolder}
              error={error}
            />
          ))}
        </div>
      ) : isExpanded ? (
        <div className="pl-4 text-gray-500">- No folders</div>
      ) : null}

      {error && <div className="text-red-500 mt-2">{error}</div>}

      <DeleteFolderModal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCloseDeleteModal}
        onDeleteFolder={handleDeleteFolder}
        folderName={selectedFolderName || ""}
        folderId={selectedFolderId || ""}
      />
    </div>
  );
};

export default TreeView;
