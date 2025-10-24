"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Share, Download, Eye, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'

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

interface CommunityCardProps {
  post: CommunityPost;
}

export default function CommunityCard({ post }: CommunityCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/community/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.setAttribute('download', `product-${post.id}.png`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this AI-generated product image by ${post.userName}`,
          text: post.productDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const truncatedDescription = post.productDescription.length > 100 
    ? post.productDescription.substring(0, 100) + '...'
    : post.productDescription;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={post.finalProductImageUrl}
          alt={post.productDescription}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleDownload(post.finalProductImageUrl)}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleShare}
                className="h-8 w-8 p-0"
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
            {post.category}
          </span>
        </div>

        {/* Video Indicator */}
        {post.videoUrl && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Video
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.userAvatar} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{post.userName}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <p className="text-gray-700 text-sm">
            {showFullDescription ? post.productDescription : truncatedDescription}
          </p>
          {post.productDescription.length > 100 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-[#02BCCC] text-xs hover:underline mt-1"
            >
              {showFullDescription ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-gray-400 text-xs">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLike}
              className={`flex items-center gap-1 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likes}</span>
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-500 flex items-center gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{post.comments}</span>
            </Button>
          </div>

          <div className="text-xs text-gray-400">
            {post.style}
          </div>
        </div>
      </div>
    </div>
  );
}
