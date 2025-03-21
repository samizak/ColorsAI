import { ArrowLeft, Save, Trash2, Download, Share2 } from "lucide-react";

// Add sidebarCollapsed to props
interface HeaderProps {
  title: string;
  setTitle: (title: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onDownload: () => void;
  isSaving: boolean;
  isDeleting: boolean;
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  setTitle,
  onSave,
  onDelete,
  onDownload,
  isSaving,
  isDeleting,
  sidebarCollapsed,
}) => {
  // Calculate the left margin based on sidebar state
  const leftMargin = sidebarCollapsed ? "60px" : "240px";

  return (
    <header
      className="fixed top-0 right-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
      style={{ left: leftMargin }}
    >
      <div className="container mx-auto px-4">
        <div className="h-[56px] flex items-center justify-between gap-2 sm:gap-4">
          {/* Left section with back button and title */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            <button
              onClick={() => window.history.back()}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors cursor-pointer shrink-0"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full max-w-[420px] px-3 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-sm font-medium transition-colors"
              placeholder="Enter a title"
            />
          </div>

          {/* Right section with actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onDownload}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors cursor-pointer"
                title="Download"
              >
                <Download className="h-4.5 w-4.5" />
              </button>
              <button
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors cursor-pointer"
                title="Share"
              >
                <Share2 className="h-4.5 w-4.5" />
              </button>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-0.5" />
            </div>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-1.5 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title="Delete"
            >
              {isDeleting ? (
                <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent dark:border-red-400 dark:border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="h-4.5 w-4.5" />
              )}
            </button>

            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-3 sm:px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
