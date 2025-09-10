interface EmptyStateProps {
  onBrowseFeedClick: () => void
}

export function EmptyState({ onBrowseFeedClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg shadow-md max-w-md mx-auto my-12">
      <h3 className="text-2xl font-semibold text-primary mb-2">No saved items yet</h3>
      <p className="text-tertiary text-center mb-6">Start saving items from your feed to see them here!</p>
      <button 
        className="px-6 py-3 bg-primary text-primary font-semibold rounded-md shadow-lg hover:bg-button-primary-hover transition-all"
        onClick={onBrowseFeedClick}
      >
        Browse Feed
      </button>
    </div>
  )
}
