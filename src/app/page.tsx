"use client";
import React, { useState } from "react";
import TreeView from "../components/TreeView";
import { useFolders } from "../hooks/useFolders";
import AddFolderModal from "@/components/AddFolderModel";
import DeleteFolderModal from "@/components/DeleteFolderModel";

const Page: React.FC = () => {
  const { folders, addFolder, deleteFolder, loading, error } = useFolders();
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [selectedFolderName, setSelectedFolderName] = useState("");

  const handleAddFolder = (parentId: string) => {
    setSelectedFolderId(parentId);
    setAddModalOpen(true);
  };

  const handleDeleteFolder = (folderId: string, folderName: string) => {
    setSelectedFolderId(folderId);
    setSelectedFolderName(folderName);
    setDeleteModalOpen(true);
  };
  // if (loading) return <div>Loading...</div>;
  // if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Folder Structure Viewer</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {folders.map((folder) => (
        <TreeView
          key={folder.id}
          folder={folder}
          onAddFolder={handleAddFolder}
          onDeleteFolder={() => {
            deleteFolder(selectedFolderId);
            setDeleteModalOpen(false);
          }}
        />
      ))}

      <AddFolderModal
        isOpen={isAddModalOpen}
        onRequestClose={() => setAddModalOpen(false)}
        onAddFolder={addFolder}
        parentId={selectedFolderId}
      />

      <DeleteFolderModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
        onDeleteFolder={() => {
          deleteFolder(selectedFolderId);
          setDeleteModalOpen(false);
        }}
        folderName={
          folders.find((folder) => folder.id === selectedFolderId)?.name || ""
        }
        folderId={selectedFolderId}
      />
    </div>
  );
};

export default Page;
