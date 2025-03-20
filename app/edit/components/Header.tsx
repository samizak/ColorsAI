import { ArrowLeft, Save, Trash2, Download, Share2 } from "lucide-react";

interface HeaderProps {
  title: string;
  setTitle: (title: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onDownload: () => void;
  isSaving: boolean;
}

export default function Header({
  title,
  setTitle,
  onSave,
  onDelete,
  onDownload,
  isSaving,
}: HeaderProps) {
  return (
    <header className="h-[57px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 backdrop-blur-sm">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Left section with back button and title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors cursor-pointer"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[420px] px-3 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-sm font-medium transition-colors"
            placeholder="Enter a title"
          />
        </div>

        {/* Right section with actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
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
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-md transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          </div>

          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
} 