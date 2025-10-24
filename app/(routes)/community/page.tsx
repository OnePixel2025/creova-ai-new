"use client"
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '@/app/provider'
import { useRouter } from 'next/navigation'
import CommunityCard from './_components/CommunityCard'
import CommunityFilters from './_components/CommunityFilters'
import { Loader2Icon, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productDescription: string;
  finalProductImageUrl: string;
  videoUrl?: string;
  category: string;
  style: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: any;
  isPublic: boolean;
}

export default function CommunityPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCommunityPosts();
  }, [user, router]);

  const fetchCommunityPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community/posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching community posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.productDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesStyle = selectedStyle === 'all' || post.style === selectedStyle;
    
    return matchesSearch && matchesCategory && matchesStyle;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2Icon className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Community Gallery</h1>
        <p className="text-gray-600 text-lg">
          Discover amazing AI-generated product images and get inspired by our creative community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products, tags, or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <CommunityFilters
            selectedCategory={selectedCategory}
            selectedStyle={selectedStyle}
            onCategoryChange={setSelectedCategory}
            onStyleChange={setSelectedStyle}
          />
        )}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">No posts found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory !== 'all' || selectedStyle !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Be the first to share your AI-generated product images!'
            }
          </p>
          {!searchQuery && selectedCategory === 'all' && selectedStyle === 'all' && (
            <Button onClick={() => router.push('/creative-ai-tools')}>
              Create Your First Image
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <CommunityCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-bold text-[#02BCCC]">{posts.length}</div>
            <div className="text-gray-600">Total Creations</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#CCFF02]">
              {posts.reduce((sum, post) => sum + post.likes, 0)}
            </div>
            <div className="text-gray-600">Total Likes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#02BCCC]">
              {new Set(posts.map(post => post.userId)).size}
            </div>
            <div className="text-gray-600">Active Creators</div>
          </div>
        </div>
      </div>
    </div>
  );
}
