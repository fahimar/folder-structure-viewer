import React, { useState } from "react";

interface Folder {
  id: string;
  name: string;
  children?: Folder[];
}

interface TreeViewProps {
  folder: Folder;
  onAddFolder: (parentId: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

const TreeView: React.FC<TreeViewProps> = ({
  folder,
  onAddFolder,
  onDeleteFolder,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="pl-4">
      <div className="flex items-center gap-x-10 space-y-2">
        <span className="cursor-pointer" onClick={toggleExpand}>
          {isExpanded ? "▼" : "▶"} {folder.name}
        </span>
        {folder.id !== "root" && (
          <button
            className="bg-red-500 text-white px-2 py-1 rounded-full"
            onClick={() => onDeleteFolder(folder.id)}
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
              />
            ))}
          </div>
        ) : (
          <div className="pl-4 text-gray-500">- No folders</div>
        )
      ) : null}
    </div>
  );
};

export default TreeView;
