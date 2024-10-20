import { useState, useEffect } from "react";
import axios from "axios";

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  children?: Folder[];
}

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // backend API
  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Folder[]>(
          "http://localhost:5000/api/folders/"
        );
        setFolders(response.data);
      } catch (err) {
        console.error("Error fetching folders:", err);
        setError(
          "Failed to fetch folders. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  // Add a folder via API
  const addFolder = async (name: string, parentId: string) => {
    setError(null); // Reset error before making the API call
    try {
      const response = await axios.post("http://localhost:5000/api/folders/", {
        name,
        parentId,
      });
      const newFolder: Folder = response.data;
      const updatedFolders = addFolderToTree(folders, parentId, newFolder);
      setFolders(updatedFolders);
    } catch (err) {
      console.error("Error adding folder:", err);
      setError(
        "Failed to add folder. Please check your connection and try again."
      );
    }
  };

  // Delete a folder via API
  const deleteFolder = async (folderId: string) => {
    setError(null);
    try {
      await axios.delete(`http://localhost:5000/api/folders/${folderId}`);
      const updatedFolders = deleteFolderFromTree(folders, folderId);
      setFolders(updatedFolders);
    } catch (err) {
      console.error("Error deleting folder:", err);
      setError(
        "Failed to delete folder. Please check your connection and try again."
      );
    }
  };

  return { folders, addFolder, deleteFolder, loading, error };
};

// Helper function to add a folder to the tree
const addFolderToTree = (
  folders: Folder[],
  parentId: string,
  newFolder: Folder
): Folder[] => {
  return folders.map((folder) => {
    if (folder.id === parentId) {
      return { ...folder, children: [...(folder.children || []), newFolder] };
    }
    if (folder.children) {
      return {
        ...folder,
        children: addFolderToTree(folder.children, parentId, newFolder),
      };
    }
    return folder;
  });
};

// Helper function to delete a folder from the tree
const deleteFolderFromTree = (
  folders: Folder[],
  folderId: string
): Folder[] => {
  return folders
    .filter((folder) => folder.id !== folderId)
    .map((folder) => ({
      ...folder,
      children: folder.children
        ? deleteFolderFromTree(folder.children, folderId)
        : [],
    }));
};
