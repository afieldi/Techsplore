interface EmptyStateProps {
  onBrowseFeedClick: () => void
}

export function EmptyState({ onBrowseFeedClick }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h3>No saved items yet</h3>
      <p>Start saving items from your feed to see them here!</p>
      <button 
        className="auth-button" 
        onClick={onBrowseFeedClick}
        style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
      >
        Browse Feed
      </button>
    </div>
  )
}
