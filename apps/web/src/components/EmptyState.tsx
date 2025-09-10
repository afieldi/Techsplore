interface EmptyStateProps {
  onBrowseFeedClick: () => void
}

export function EmptyState({ onBrowseFeedClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-auto my-12">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No saved items yet</h3>
      <p className="text-gray-700 dark:text-gray-300 text-center mb-6">Start saving items from your feed to see them here!</p>
      <button 
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
        onClick={onBrowseFeedClick}
      >
        Browse Feed
      </button>
    </div>
  )
}
