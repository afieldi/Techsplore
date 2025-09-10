import { trpc } from '../lib/trpc'
import { useAuth } from '../contexts/AuthContext'

export interface FeedItem {
  id: string
  title: string
  url: string
  imageUrl?: string
  source: string
  price?: number
  tags: string[]
  publishedAt: string
  summary?: string
}

export function FeedCard({ item }: { item: FeedItem }) {
  const { user } = useAuth()
  const saveItemMutation = trpc.saveItem.useMutation()

  const formatPrice = (price?: number) => {
    if (!price) return null
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    )
  }

  const handleSave = async () => {
    if (!user) return
    try {
      await saveItemMutation.mutateAsync({ itemId: item.id })
    } catch (error) {
      console.error('Failed to save item:', error)
    }
  }

  return (
    <article className="feed-card">
      <div className="feed-card-image">
        {item.imageUrl && (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            loading="lazy"
          />
        )}
        <div className="source-badge">
          {item.source}
        </div>
        {user && (
          <button 
            className="save-button"
            onClick={handleSave}
            disabled={saveItemMutation.isPending}
            title={saveItemMutation.isSuccess ? 'Saved!' : 'Save item'}
          >
            {saveItemMutation.isSuccess ? '✓' : '♡'}
          </button>
        )}
      </div>
      
      <div className="feed-card-content">
        <header className="feed-card-header">
          <h2 className="feed-card-title">
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          </h2>
          {item.price && (
            <span className="feed-card-price">{formatPrice(item.price)}</span>
          )}
        </header>
        
        {item.summary && (
          <p className="feed-card-summary">{item.summary}</p>
        )}
        
        <footer className="feed-card-footer">
          <div className="feed-card-tags">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="tag tag-more">+{item.tags.length - 3}</span>
            )}
          </div>
          <time className="feed-card-date">
            {formatDate(new Date(item.publishedAt))}
          </time>
        </footer>
      </div>
    </article>
  )
}
