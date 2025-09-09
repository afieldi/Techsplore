import './App.css'
import { trpc } from './lib/trpc'
import { useAuth } from './contexts/AuthContext'
import { AuthModal } from './components/AuthModal'
import { useState } from 'react'

interface FeedItem {
  id: string
  title: string
  url: string
  imageUrl?: string
  source: string
  price?: number
  tags: string[]
  publishedAt: Date
  summary?: string
}

function FeedCard({ item }: { item: FeedItem }) {
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
            {formatDate(item.publishedAt)}
          </time>
        </footer>
      </div>
    </article>
  )
}

function UserMenu({ onViewSavedItems }: { onViewSavedItems: () => void }) {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  return (
    <div className="user-menu">
      <button 
        className="user-menu-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.name || user.email}
      </button>
      
      {isOpen && (
        <div className="user-menu-dropdown">
          <button className="user-menu-item">
            My Profile
          </button>
          <button 
            className="user-menu-item"
            onClick={() => {
              onViewSavedItems()
              setIsOpen(false)
            }}
          >
            Saved Items
          </button>
          <button 
            className="user-menu-item danger"
            onClick={() => {
              logout()
              setIsOpen(false)
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

type FeedView = 'discover' | 'personalized' | 'saved'

function App() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentView, setCurrentView] = useState<FeedView>('discover')

  // Use personalized feed if user is authenticated and on discover view
  const shouldUsePersonalizedFeed = user && currentView === 'discover'
  
  const { data: regularFeedData, isLoading: regularFeedLoading, error: regularFeedError } = trpc.feed.useQuery(
    { limit: 20 }, 
    { enabled: !shouldUsePersonalizedFeed && currentView !== 'saved' }
  )
  
  const { data: personalizedFeedData, isLoading: personalizedFeedLoading, error: personalizedFeedError } = trpc.personalizedFeed.useQuery(
    { limit: 20 }, 
    { enabled: shouldUsePersonalizedFeed }
  )
  
  const { data: savedItemsData, isLoading: savedItemsLoading, error: savedItemsError } = trpc.savedItems.useQuery(
    { limit: 20 }, 
    { enabled: currentView === 'saved' && !!user }
  )

  // Determine which data to use
  const data = currentView === 'saved' ? savedItemsData : 
               shouldUsePersonalizedFeed ? personalizedFeedData : regularFeedData
  const isLoading = currentView === 'saved' ? savedItemsLoading :
                   shouldUsePersonalizedFeed ? personalizedFeedLoading : regularFeedLoading
  const error = currentView === 'saved' ? savedItemsError :
               shouldUsePersonalizedFeed ? personalizedFeedError : regularFeedError

  if (isLoading) {
    return (
      <div className="app">
        <header className="app-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Techsplore</h1>
            </div>
            {user ? <UserMenu onViewSavedItems={() => setCurrentView('saved')} /> : (
              <button className="auth-button" onClick={() => setShowAuthModal(true)}>
                Sign In
              </button>
            )}
          </div>
        </header>
        <main className="feed-container">
          <div className="loading-spinner">Loading...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Techsplore</h1>
            </div>
            {user ? <UserMenu onViewSavedItems={() => setCurrentView('saved')} /> : (
              <button className="auth-button" onClick={() => setShowAuthModal(true)}>
                Sign In
              </button>
            )}
          </div>
        </header>
        <main className="feed-container">
          <div className="error-message">
            Error loading feed: {error.message}
          </div>
        </main>
      </div>
    )
  }

  const getPageTitle = () => {
    switch (currentView) {
      case 'saved': return 'Your Saved Items'
      case 'discover': return user ? 'Your Personalized Feed' : 'Latest Tech Discoveries'
      default: return 'Discover the latest in tech and innovation'
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h1>Techsplore</h1>
            <p className="app-tagline">{getPageTitle()}</p>
          </div>
          <div style={{ position: 'absolute', right: '2rem', top: '2rem' }}>
            {user ? <UserMenu onViewSavedItems={() => setCurrentView('saved')} /> : (
              <button className="auth-button" onClick={() => setShowAuthModal(true)}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {user && (
        <div className="feed-nav">
          <div className="feed-nav-container">
            <button 
              className={`feed-nav-tab ${currentView === 'discover' ? 'active' : ''}`}
              onClick={() => setCurrentView('discover')}
            >
              For You
            </button>
            <button 
              className={`feed-nav-tab ${currentView === 'saved' ? 'active' : ''}`}
              onClick={() => setCurrentView('saved')}
            >
              Saved Items
            </button>
          </div>
        </div>
      )}
      
      <main className="feed-container">
        {currentView === 'saved' && (!data?.items?.length) && !isLoading && (
          <div className="empty-state">
            <h3>No saved items yet</h3>
            <p>Start saving items from your feed to see them here!</p>
            <button 
              className="auth-button" 
              onClick={() => setCurrentView('discover')}
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              Browse Feed
            </button>
          </div>
        )}
        
        <div className="feed-grid">
          {data?.items?.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))}
        </div>
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
}

export default App
