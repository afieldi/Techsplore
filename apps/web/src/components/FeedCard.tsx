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
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 w-full">
        {item.imageUrl && (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            loading="lazy"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {item.source}
        </div>
        {user && (
          <button 
            className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:scale-110 transition-transform"
            onClick={handleSave}
            disabled={saveItemMutation.isPending}
            title={saveItemMutation.isSuccess ? 'Saved!' : 'Save item'}
          >
            {saveItemMutation.isSuccess ? '✓' : '♡'}
          </button>
        )}
      </div>
      
      <div className="p-4 flex flex-col justify-between">
        <div>
          <header className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight pr-2">
              <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {item.title}
              </a>
            </h2>
            {item.price && (
              <span className="text-lg font-bold text-green-600 dark:text-green-400 whitespace-nowrap">{formatPrice(item.price)}</span>
            )}
          </header>
          
          {item.summary && (
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">{item.summary}</p>
          )}
        </div>
        
        <footer className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
          <time className="flex-shrink-0">
            {formatDate(new Date(item.publishedAt))}
          </time>
        </footer>
      </div>
    </article>
  )
}
