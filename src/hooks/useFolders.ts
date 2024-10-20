import { useState, useEffect } from "react";
import axios from "axios";

interface Folder {
  id: string;
  name: string;
  parentId?: string | null;
  children?: Folder[];
}

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch folders from the backend API
  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:5000/api/folders/");

        // Map _id to id and build the folder tree structure
        const mappedFolders = mapFoldersToTree(
          response.data.map((folder: any) => ({
            id: folder._id,
            name: folder.name,
            parentId: folder.parentId || null,
            children: [],
          }))
        );

        setFolders(mappedFolders);
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
  const addFolder = async (name: string, parentId: string | null) => {
    setError(null); // Reset error

    try {
      const response = await axios.post("http://localhost:5000/api/folders/", {
        name,
        parentId,
      });

      const newFolder: Folder = {
        id: response.data._id,
        name: response.data.name,
        parentId: response.data.parentId || null,
        children: [],
      };

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
  const deleteFolder = async (folderId: string | undefined) => {
    if (!folderId) {
      setError("Folder ID is undefined. Cannot delete folder.");
      return;
    }

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

// tree structure
const mapFoldersToTree = (folders: Folder[]): Folder[] => {
  const folderMap: { [key: string]: Folder } = {};

  folders.forEach((folder) => {
    folderMap[folder.id] = { ...folder, children: [] };
  });

  const rootFolders: Folder[] = [];

  // build the folder tree
  folders.forEach((folder) => {
    if (folder.parentId) {
      folderMap[folder.parentId].children!.push(folderMap[folder.id]);
    } else {
      rootFolders.push(folderMap[folder.id]);
    }
  });

  return rootFolders;
};

// Helper function to add a folder to the tree
const addFolderToTree = (
  folders: Folder[],
  parentId: string | null,
  newFolder: Folder
): Folder[] => {
  if (!parentId) {
    return [...folders, newFolder];
  }

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
