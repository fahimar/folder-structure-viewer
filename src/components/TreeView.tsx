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
  onDeleteFolder: (folderId: string) => void;
  error?: string;
}

const TreeView: React.FC<TreeViewProps> = ({
  folder,
  onAddFolder,
  onDeleteFolder,
  error,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleOpenDeleteModal = (folderId: string) => {
    setSelectedFolderId(folderId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleConfirmDeleteFolder = () => {
    onDeleteFolder(selectedFolderId);
    setDeleteModalOpen(false);
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
            onClick={() => handleOpenDeleteModal(folder.id)}
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
      {/* Handle expanded view and children */}
      {isExpanded ? (
        folder.children && folder.children.length > 0 ? (
          <div>
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
        ) : (
          <div className="pl-4 text-gray-500">- No folders</div>
        )
      ) : null}

      {error && <div className="text-red-500 mt-2">{error}</div>}

      {/* Delete Folder Modal */}
      <DeleteFolderModal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCloseDeleteModal}
        onDeleteFolder={handleConfirmDeleteFolder}
        folderName={folder.name}
        folderId={selectedFolderId}
      />
    </div>
  );
};

export default TreeView;
