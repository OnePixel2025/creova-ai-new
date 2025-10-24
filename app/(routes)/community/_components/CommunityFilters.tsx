"use client"
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CommunityFiltersProps {
  selectedCategory: string;
  selectedStyle: string;
  onCategoryChange: (category: string) => void;
  onStyleChange: (style: string) => void;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion & Beauty' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'sports', label: 'Sports & Fitness' },
  { value: 'books', label: 'Books & Media' },
  { value: 'toys', label: 'Toys & Games' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'other', label: 'Other' }
];

const styles = [
  { value: 'all', label: 'All Styles' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'professional', label: 'Professional' },
  { value: 'playful', label: 'Playful' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'modern', label: 'Modern' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'artistic', label: 'Artistic' }
];

export default function CommunityFilters({
  selectedCategory,
  selectedStyle,
  onCategoryChange,
  onStyleChange
}: CommunityFiltersProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style
          </label>
          <Select value={selectedStyle} onValueChange={onStyleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
