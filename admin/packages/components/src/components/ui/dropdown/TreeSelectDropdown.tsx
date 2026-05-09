import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, ChevronRight, X, Search, XCircle } from "lucide-react";
import { FieldError, Merge } from "react-hook-form";

interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
  parentId?: string;
  level?: number;
}

interface SelectedItem {
  value: string;
  label: string;
  type: 'parent' | 'child';
  parentId?: string;
  parentLabel?: string;
}

interface TreeSelectDropdownProps {
  title: string;
  data: TreeNode[];
  value: string[];
  onChange: (value: string[], selectedItems: SelectedItem[]) => void;
  errorMessage?: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  width?: string;
  placeholder?: string;
  allowParentSelection?: boolean;
  maxDisplayItems?: number;
  showParentInSelection?: boolean;
  hideParentOnlySelections?: boolean; // New prop to hide parent-only selections from input bar
  border?: string;
  height?: string
}

const TreeSelectDropdown: React.FC<TreeSelectDropdownProps> = ({
  width = "w-full",
  title,
  data,
  value = [],
  onChange,
  errorMessage,
  placeholder,
  allowParentSelection = true, // Fixed: uncommented and set default
  maxDisplayItems = 3,
  showParentInSelection = false, // Default to showing parent info
  hideParentOnlySelections = false, // Default to showing all selections
  border,
  height = 'min-h-12'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Flatten tree structure for easier processing
  const flattenedData = useMemo(() => {
    const flatten = (nodes: TreeNode[], level = 0, parentId?: string): TreeNode[] => {
      return nodes.reduce((acc: TreeNode[], node) => {
        const flatNode = { ...node, level, parentId };
        acc.push(flatNode);
        if (node.children) {
          acc.push(...flatten(node.children, level + 1, node.value));
        }
        return acc;
      }, []);
    };
    return flatten(data);
  }, [data]);

  // Get selected items with metadata and filter based on hideParentOnlySelections
  const selectedItems = useMemo(() => {
    const allSelectedItems = value?.map(val => {
      const item = flattenedData.find(node => node.value === val);
      if (!item) return null;
      
      const isChild = item.parentId !== undefined;
      const parentNode = isChild ? flattenedData.find(node => node.value === item.parentId) : null;
      
      return {
        value: item.value,
        label: item.label,
        type: isChild ? 'child' : 'parent',
        parentId: item.parentId,
        parentLabel: parentNode?.label
      } as SelectedItem;
    }).filter(Boolean) as SelectedItem[];

    // Filter out parent selections from display if hideParentOnlySelections is true
    if (hideParentOnlySelections) {
      return allSelectedItems.filter(item => item.type === 'child');
    }

    return allSelectedItems;
  }, [value, flattenedData, hideParentOnlySelections]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const filterTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.reduce((acc: TreeNode[], node) => {
        const nodeMatches = node.label.toLowerCase().includes(searchTerm.toLowerCase());
        const filteredChildren = node.children ? filterTree(node.children) : [];
        
        if (nodeMatches || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children
          });
          // Auto-expand nodes when searching
          if (filteredChildren.length > 0) {
            setExpandedNodes(prev => new Set([...prev, node.value]));
          }
        }
        
        return acc;
      }, []);
    };
    
    return filterTree(data);
  }, [data, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const toggleNode = (nodeValue: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeValue)) {
        newSet.delete(nodeValue);
      } else {
        newSet.add(nodeValue);
      }
      return newSet;
    });
  };

  const clearAllSelections = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange([], []);
  };

  const toggleSelection = (nodeValue: string) => {
    const node = flattenedData.find(n => n.value === nodeValue);
    if (!node) return;

    // Check if this is a parent node and if parent selection is allowed
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren && !allowParentSelection) {
      // If parent selection is not allowed, just expand/collapse the node
      toggleNode(nodeValue);
      return;
    }

    const isSelected = value.includes(nodeValue);
    let newValue: string[];

    if (isSelected) {
      // Remove selection
      newValue = value.filter(v => v !== nodeValue);
      
      // If removing a parent, also remove all its children
      if (node.children) {
        const getAllChildValues = (children: TreeNode[]): string[] => {
          return children.reduce((acc: string[], child) => {
            acc.push(child.value);
            if (child.children) {
              acc.push(...getAllChildValues(child.children));
            }
            return acc;
          }, []);
        };
        
        const childValues = getAllChildValues(node.children);
        newValue = newValue.filter(v => !childValues.includes(v));
      }
      
      // If removing a child, check if parent should be removed too
      if (node.parentId && allowParentSelection) {
        const parent = flattenedData.find(n => n.value === node.parentId);
        if (parent && parent.children) {
          const siblingValues = parent.children.map(child => child.value);
          const remainingSiblings = siblingValues.filter(siblingValue => 
            newValue.includes(siblingValue) && siblingValue !== nodeValue
          );
          
          // If no siblings are selected and parent was selected, remove parent
          if (remainingSiblings.length === 0 && newValue.includes(node.parentId)) {
            newValue = newValue.filter(v => v !== node.parentId);
          }
        }
      }
    } else {
      // Add selection
      if (hasChildren && allowParentSelection) {
        // If selecting a parent and parent selection is allowed, select the parent and all its children
        const getAllChildValues = (children: TreeNode[]): string[] => {
          return children.reduce((acc: string[], child) => {
            acc.push(child.value);
            if (child.children) {
              acc.push(...getAllChildValues(child.children));
            }
            return acc;
          }, []);
        };
        
        const childValues = getAllChildValues(node.children!);
        newValue = [...new Set([...value, nodeValue, ...childValues])];
      } else if (!hasChildren) {
        // If selecting a child
        newValue = [...value, nodeValue];
        
        // Check if all siblings are now selected, if so, select the parent too (only if allowed)
        if (node.parentId && allowParentSelection) {
          const parent = flattenedData.find(n => n.value === node.parentId);
          if (parent && parent.children) {
            const siblingValues = parent.children.map(child => child.value);
            const selectedSiblings = siblingValues.filter(siblingValue => 
              newValue.includes(siblingValue)
            );
            
            // If all siblings are selected, also select the parent
            if (selectedSiblings.length === parent.children.length && !newValue.includes(node.parentId)) {
              newValue = [...newValue, node.parentId];
            }
          }
        }
      } else {
        // Parent node but parent selection not allowed - just return current value
        return;
      }
    }

    // Update selected items
    const updatedSelectedItems = newValue?.map(val => {
      const item = flattenedData.find(node => node.value === val);
      if (!item) return null;
      
      const isChild = item.parentId !== undefined;
      const parentNode = isChild ? flattenedData.find(node => node.value === item.parentId) : null;
      
      return {
        value: item.value,
        label: item.label,
        type: isChild ? 'child' : 'parent',
        parentId: item.parentId,
        parentLabel: parentNode?.label
      } as SelectedItem;
    }).filter(Boolean) as SelectedItem[];

    onChange(newValue, updatedSelectedItems);
  };

  const removeSelection = (nodeValue: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    // Get the node being removed
    const node = flattenedData.find(n => n.value === nodeValue);
    if (!node) return;

    let newValue = value.filter(v => v !== nodeValue);
    
    // If removing a child, check if parent should be removed too
    if (node.parentId && allowParentSelection) {
      const parent = flattenedData.find(n => n.value === node.parentId);
      if (parent && parent.children) {
        const siblingValues = parent.children.map(child => child.value);
        const remainingSiblings = siblingValues.filter(siblingValue => 
          newValue.includes(siblingValue)
        );
        
        // If no siblings are selected and parent was selected, remove parent
        if (remainingSiblings.length === 0 && newValue.includes(node.parentId)) {
          newValue = newValue.filter(v => v !== node.parentId);
        }
      }
    }
    
    const updatedSelectedItems = newValue?.map(val => {
      const item = flattenedData.find(node => node.value === val);
      if (!item) return null;
      
      const isChild = item.parentId !== undefined;
      const parentNode = isChild ? flattenedData.find(node => node.value === item.parentId) : null;
      
      return {
        value: item.value,
        label: item.label,
        type: isChild ? 'child' : 'parent',
        parentId: item.parentId,
        parentLabel: parentNode?.label
      } as SelectedItem;
    }).filter(Boolean) as SelectedItem[];

    onChange(newValue, updatedSelectedItems);
  };

  const toggleDropdown = (): void => {
    setIsOpen((prev: boolean) => !prev);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  const renderTreeNodes = (nodes: TreeNode[], level = 0): React.ReactNode => {
    return nodes.map((node) => {
      const isExpanded = expandedNodes.has(node.value);
      const isSelected = value.includes(node.value);
      const hasChildren = node.children && node.children.length > 0;
      const paddingLeft = level * 20 + 12;
      const canSelect = !hasChildren || allowParentSelection;

      return (
        <div key={node.value}>
          <div
            className={`flex items-center px-3 py-2 rounded-md ${
              canSelect ? 'cursor-pointer' : 'cursor-default'
            } ${
              isSelected
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                : canSelect 
                  ? "hover:bg-gray-100 dark:hover:bg-black/50 dark:text-white/90"
                  : "text-gray-600 dark:text-gray-400"
            }`}
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation();
                  toggleNode(node.value);
                }}
                className="mr-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="text-gray-500" />
                ) : (
                  <ChevronRight size={14} className="text-gray-500" />
                )}
              </button>
            )}
            
            {!hasChildren && <div className="w-6 mr-2" />}
            
            <div
              className="flex items-center flex-1"
              onClick={() => canSelect && toggleSelection(node.value)}
            >
              <div className="mr-3 flex-shrink-0">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center ${
                    isSelected
                      ? "bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600"
                      : canSelect
                        ? "border-gray-300 dark:border-gray-600"
                        : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-black"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  )}
                </div>
              </div>
              <span className="flex-1">{node.label}</span>
            </div>
          </div>
          
          {hasChildren && isExpanded && (
            <div>
              {renderTreeNodes(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className={`${width} relative`} ref={dropdownRef}>
          <div
            className={`${border ? `` : `cstm-select`} ${border} bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-gray-800 px-4 flex flex-wrap items-center ${height} cursor-pointer shadow-sm focus:outline-none focus:ring-2 transition duration-150 overflow-auto ${
              isOpen
                ? "ring-2 ring-blue-500 border-blue-500 dark:ring-blue-400 dark:border-blue-400"
                : "hover:border-gray-400 dark:hover:border-gray-700"
            } `}
            onClick={toggleDropdown}
          >
            {selectedItems.length === 0 && (
              <span className="text-gray-500 dark:text-white/60">
                {placeholder || `Select ${title}...`}
              </span>
            )}
            
            {selectedItems.slice(0, maxDisplayItems).map((item) => (
              <div
                key={item.value}
                className="flex items-center bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md px-2 py-1 m-1 text-sm-v2 text-blue-800 dark:text-blue-200"
              >
                <span className="mr-1">
                  {item.type === 'child' && item.parentLabel && showParentInSelection
                    ? `${item.parentLabel} > ${item.label}`
                    : item.label
                  }
                </span>
                <button
                  onClick={(e) => 
                  {
                    e.preventDefault()
                    removeSelection(item.value, e)
                  }
                  }
                  className="text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100 focus:outline-none"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            <div className="flex">
              {selectedItems.length > maxDisplayItems && (
                <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  +{selectedItems.length - maxDisplayItems} more
                </span>
              )}
            </div>
            
            <div className="ml-auto flex items-center">
              {selectedItems.length > 0 && (
                <>
                  <button
                    onClick={clearAllSelections}
                    className="mr-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    title="Clear all selections"
                  >
                    <XCircle size={16} />
                  </button>
                  <span className="mr-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    {selectedItems.length}
                  </span>
                </>
              )}
              <ChevronDown
                size={18}
                className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {isOpen && (
            <div className="absolute mt-1 w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10 max-h-[48vh] overflow-y-auto z-100">
              <div className="p-2 sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white/90 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Search options..."
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              
              <div className="p-2">
                {filteredData.length > 0 ? (
                  renderTreeNodes(filteredData)
                ) : (
                  <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                    No options match your search
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {errorMessage && (
        <p className="mt-1.5 text-xs text-error-500">{errorMessage?.message}</p>
      )}
    </div>
  );
};

export default TreeSelectDropdown;