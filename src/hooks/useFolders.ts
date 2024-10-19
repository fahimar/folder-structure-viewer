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

  // Fetch folder structure from API
  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching

      try {
        const response = await axios.get<Folder[]>(
          "http://localhost:5000/api/folders/"
        );
        setFolders(response.data); // Set the fetched folder structure
      } catch (err) {
        console.error("Error fetching folders:", err);
        setError("Failed to fetch folders.");
      } finally {
        setLoading(false); // Stop loading after data is fetched or an error occurs
      }
    };

    fetchFolders(); // Call the function when component is mounted
  }, []);

  // Add a new folder via API
  const addFolder = async (name: string, parentId: string) => {
    setError(null); // Reset error before adding

    try {
      const response = await axios.post<Folder>(
        "http://localhost:5000/api/folders/",
        {
          name,
          parentId,
        }
      );
      const newFolder: Folder = response.data;

      // Update the local folder tree
      const updatedFolders = addFolderToTree(folders, parentId, newFolder);
      setFolders(updatedFolders);
    } catch (err) {
      console.error("Error adding folder:", err);
      setError("Failed to add folder.");
    }
  };

  // Delete a folder via API
  const deleteFolder = async (folderId: string) => {
    if (!folderId) {
      console.error("Invalid folderId:", folderId);
      setError("Invalid folder ID.");
      return;
    }

    setError(null); // Reset error before deleting

    try {
      // Make the DELETE request to delete the folder from the backend
      await axios.delete(`http://localhost:5000/api/folders/${folderId}`);

      // Update the local folder tree by removing the deleted folder
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

// Helper function to recursively add a folder to the tree
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

// Helper function to recursively delete a folder from the tree
const deleteFolderFromTree = (
  folders: Folder[],
  folderId: string
): Folder[] => {
  return folders
    .filter((folder) => folder.id !== folderId) // Remove folder with matching ID
    .map((folder) => ({
      ...folder,
      children: folder.children
        ? deleteFolderFromTree(folder.children, folderId)
        : [],
    }));
};
