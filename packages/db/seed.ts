import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type FeedItem = {
  id: string
  title: string
  url: string
  imageUrl?: string
  source: 'amazon' | 'kickstarter' | 'drop' | 'rss' | 'other'
  price?: number
  tags: string
  publishedAt: Date
  summary?: string
}

const sampleFeedItems: Array<Omit<FeedItem, 'id'>> = [
  {
    title: "Mechanical Gaming Keyboard with RGB Backlighting",
    url: "https://example.com/mechanical-keyboard",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=300&fit=crop",
    source: "amazon" as const,
    price: 129.99,
    tags: JSON.stringify(["gaming", "keyboard", "mechanical", "rgb"]),
    publishedAt: new Date("2024-01-15T10:30:00Z"),
    summary: "Premium mechanical keyboard with Cherry MX switches, customizable RGB lighting, and programmable keys. Perfect for gaming and productivity."
  },
  {
    title: "Smart Home Security Camera System",
    url: "https://example.com/security-camera",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    source: "kickstarter" as const,
    price: 299.99,
    tags: JSON.stringify(["smart-home", "security", "camera", "surveillance"]),
    publishedAt: new Date("2024-01-14T15:20:00Z"),
    summary: "AI-powered security camera with facial recognition, night vision, and mobile alerts. Easy installation and cloud storage included."
  },
  {
    title: "Wireless Noise-Cancelling Headphones",
    url: "https://example.com/wireless-headphones",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=300&fit=crop",
    source: "amazon" as const,
    price: 249.99,
    tags: JSON.stringify(["audio", "headphones", "wireless", "noise-cancelling"]),
    publishedAt: new Date("2024-01-13T09:45:00Z"),
    summary: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and studio-quality sound."
  },
  {
    title: "Portable Solar Power Bank",
    url: "https://example.com/solar-power-bank",
    imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=300&fit=crop",
    source: "drop" as const,
    price: 89.99,
    tags: JSON.stringify(["portable", "solar", "power-bank", "outdoor"]),
    publishedAt: new Date("2024-01-12T14:15:00Z"),
    summary: "High-capacity solar power bank with wireless charging capability. Perfect for camping, hiking, and emergency situations."
  },
  {
    title: "Ergonomic Standing Desk Converter",
    url: "https://example.com/standing-desk",
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=300&fit=crop",
    source: "other" as const,
    price: 199.99,
    tags: JSON.stringify(["desk", "ergonomic", "standing", "office", "health"]),
    publishedAt: new Date("2024-01-11T11:30:00Z"),
    summary: "Adjustable standing desk converter that transforms any desk into a sit-stand workstation. Promotes better posture and health."
  },
  {
    title: "Smart Air Purifier with App Control",
    url: "https://example.com/air-purifier",
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop",
    source: "amazon" as const,
    price: 179.99,
    tags: JSON.stringify(["air-purifier", "smart", "health", "home", "app-control"]),
    publishedAt: new Date("2024-01-10T16:20:00Z"),
    summary: "HEPA air purifier with smart app control, real-time air quality monitoring, and automatic adjustment based on air quality."
  },
  {
    title: "Minimalist Wallet with RFID Blocking",
    url: "https://example.com/minimalist-wallet",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=300&fit=crop",
    source: "kickstarter" as const,
    price: 45.99,
    tags: JSON.stringify(["wallet", "minimalist", "rfid", "accessories"]),
    publishedAt: new Date("2024-01-09T13:10:00Z"),
    summary: "Ultra-slim wallet with RFID blocking technology, premium leather construction, and space for up to 12 cards."
  },
  {
    title: "Wireless Charging Pad with Fast Charge",
    url: "https://example.com/wireless-charger",
    imageUrl: "https://images.unsplash.com/photo-1609592937878-951b97b8b38b?w=500&h=300&fit=crop",
    source: "drop" as const,
    price: 39.99,
    tags: JSON.stringify(["wireless-charging", "fast-charge", "accessories", "phone"]),
    publishedAt: new Date("2024-01-08T08:45:00Z"),
    summary: "High-speed wireless charging pad compatible with all Qi-enabled devices. Features LED indicator and overheat protection."
  },
  {
    title: "Bluetooth Fitness Tracker Watch",
    url: "https://example.com/fitness-tracker",
    imageUrl: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=300&fit=crop",
    source: "amazon" as const,
    price: 99.99,
    tags: JSON.stringify(["fitness", "tracker", "watch", "bluetooth", "health"]),
    publishedAt: new Date("2024-01-07T12:00:00Z"),
    summary: "Advanced fitness tracker with heart rate monitoring, sleep tracking, GPS, and 7-day battery life. Water-resistant design."
  },
  {
    title: "Premium Coffee Grinder with Precision Settings",
    url: "https://example.com/coffee-grinder",
    imageUrl: "https://images.unsplash.com/photo-1504627298434-2119d6928e93?w=500&h=300&fit=crop",
    source: "other" as const,
    price: 159.99,
    tags: JSON.stringify(["coffee", "grinder", "kitchen", "precision", "brewing"]),
    publishedAt: new Date("2024-01-06T10:30:00Z"),
    summary: "Burr coffee grinder with 40 precision grind settings, timer function, and anti-static technology for consistent brewing."
  }
]

async function seed() {
  console.log('Starting to seed the database...')
  
  try {
    // Clear existing feed items (optional - remove if you want to keep existing data)
    await prisma.feedItem.deleteMany()
    console.log('Cleared existing feed items')
    
    // Create feed items with generated IDs
    for (let i = 0; i < sampleFeedItems.length; i++) {
      const item = sampleFeedItems[i]
      await prisma.feedItem.create({
        data: {
          id: `feed-item-${i + 1}`,
          ...item
        }
      })
    }
    
    console.log(`Successfully seeded ${sampleFeedItems.length} feed items`)
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function if this file is executed directly
seed()
  .then(() => {
    console.log('Seeding completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })

export { seed }