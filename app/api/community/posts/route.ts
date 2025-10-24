import { db } from "@/configs/firebaseConfig";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const style = searchParams.get('style');

    // Build query
    let q = query(
      collection(db, "user-ads"),
      where('status', '==', 'completed'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );

    // Add category filter if specified
    if (category && category !== 'all') {
      q = query(q, where('category', '==', category));
    }

    // Add style filter if specified
    if (style && style !== 'all') {
      q = query(q, where('style', '==', style));
    }

    // Add pagination
    q = query(q, limit(pageSize));

    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Ensure we have default values for community display
      userName: doc.data().userName || 'Anonymous',
      userAvatar: doc.data().userAvatar || null,
      category: doc.data().category || 'other',
      style: doc.data().style || 'modern',
      tags: doc.data().tags || [],
      likes: doc.data().likes || 0,
      comments: doc.data().comments || 0,
      isPublic: doc.data().isPublic || false,
      createdAt: doc.data().createdAt || new Date()
    }));

    return NextResponse.json({
      posts,
      pagination: {
        page,
        pageSize,
        total: posts.length,
        hasMore: posts.length === pageSize
      }
    });

  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community posts' },
      { status: 500 }
    );
  }
}
