import { trpc } from './lib/trpc'
import { useAuth } from './contexts/AuthContext'
import { AuthModal } from './components/AuthModal'
import { useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { FeedCard, FeedItem } from './components/FeedCard'
import { FeedNavigation } from './components/FeedNavigation'
import { EmptyState } from './components/EmptyState'

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
    { enabled: false }
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

  const getPageTitle = () => {
    switch (currentView) {
      case 'saved': return 'Your Saved Items'
      case 'discover': return user ? 'Your Personalized Feed' : 'Latest Tech Discoveries'
      default: return 'Discover the latest in tech and innovation'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex flex-col">
        <AppHeader
          getPageTitle={getPageTitle}
          onSignInClick={() => setShowAuthModal(true)}
          onViewSavedItems={() => setCurrentView('saved')}
        />
        <main className="feed-container">
          <div className="loading-spinner">Loading...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex flex-col">
        <AppHeader
          getPageTitle={getPageTitle}
          onSignInClick={() => setShowAuthModal(true)}
          onViewSavedItems={() => setCurrentView('saved')}
        />
        <main className="feed-container">
          <div className="error-message">
            Error loading feed: {error.message}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex flex-col">
      <AppHeader
        getPageTitle={getPageTitle}
        onSignInClick={() => setShowAuthModal(true)}
        onViewSavedItems={() => setCurrentView('saved')}
      />

      {user && (
        <FeedNavigation currentView={currentView} setCurrentView={setCurrentView} />
      )}
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'saved' && (!data?.items?.length) && !isLoading && (
          <EmptyState onBrowseFeedClick={() => setCurrentView('discover')} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
