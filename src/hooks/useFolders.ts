import axios from "axios";
import { useEffect, useState } from "react";

interface Folder {
  _id: string;
  id?: string;
  name: string;
  parentId?: string | null;
  children?: Folder[];
}

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        setError("Failed to fetch folders.");
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  const addFolder = async (name: string, parentId: string | null) => {
    setError(null);

    try {
      const response = await axios.post<Folder>(
        "http://localhost:5000/api/folders/",
        {
          name,
          parentId,
        }
      );
      const newFolder: Folder = response.data;

      const updatedFolders = addFolderToTree(folders, parentId, newFolder);
      setFolders(updatedFolders);
    } catch (err) {
      console.error("Error adding folder:", err);
      setError("Failed to add folder.");
    }
  };

  // Helper function to recursively add a folder to the tree
  const addFolderToTree = (
    folders: Folder[],
    parentId: string | null,
    newFolder: Folder
  ): Folder[] => {
    return folders.map((folder) => {
      if (folder._id === parentId || folder.id === parentId) {
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

  const deleteFolder = async (folderId: string) => {
    if (!folderId) {
      console.error("Folder ID is invalid:", folderId);
      setError("Folder ID is invalid.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/folders/${folderId}`);
      const updatedFolders = deleteFolderFromTree(folders, folderId);
      setFolders(updatedFolders);
    } catch (err: any) {
      console.error(
        `Error deleting folder ${folderId}:`,
        err.response?.data || err
      );
      setError("Failed to delete folder.");
    }
  };

  return { folders, addFolder, deleteFolder, loading, error };
};
// Helper function to recursively delete a folder from the tree
const deleteFolderFromTree = (
  folders: Folder[],
  folderId: string
): Folder[] => {
  return folders
    .filter((folder) => folder._id !== folderId) // Remove folder with matching _id
    .map((folder) => ({
      ...folder,
      children: folder.children
        ? deleteFolderFromTree(folder.children, folderId)
        : [],
    }));
};
