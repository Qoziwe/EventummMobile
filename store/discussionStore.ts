import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  PostData,
  CommentData,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
} from '../data/discussionMockData';

const customStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') return localStorage.getItem(name);
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') localStorage.setItem(name, value);
      else await AsyncStorage.setItem(name, value);
    } catch {}
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') localStorage.removeItem(name);
      else await AsyncStorage.removeItem(name);
    } catch {}
  },
};

interface DiscussionState {
  posts: PostData[];
  comments: Record<string, CommentData[]>;
  addPost: (
    post: Omit<
      PostData,
      'id' | 'timestamp' | 'upvotes' | 'downvotes' | 'commentCount' | 'votedUsers'
    >
  ) => void;
  addComment: (
    postId: string,
    authorId: string,
    authorName: string,
    content: string,
    parentId?: string
  ) => void;
  votePost: (postId: string, userId: string, type: 'up' | 'down') => void;
  getPostById: (id: string) => PostData | undefined;
  getCommentsByPostId: (postId: string) => CommentData[];
  clearAllDiscussions: () => Promise<void>;
}

export const useDiscussionStore = create<DiscussionState>()(
  persist(
    (set, get) => ({
      posts: INITIAL_POSTS || [],
      comments: INITIAL_COMMENTS || {},

      getPostById: id => {
        const currentPosts = get().posts || [];
        return currentPosts.find(p => p.id === id);
      },

      getCommentsByPostId: postId => {
        const currentComments = get().comments || {};
        return currentComments[postId] || [];
      },

      addPost: data => {
        const newPost: PostData = {
          ...data,
          id: `post_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          upvotes: 0,
          downvotes: 0,
          commentCount: 0,
          votedUsers: {},
          ageLimit: data.ageLimit || 0,
        };
        set(state => ({
          posts: [newPost, ...(state.posts || [])],
        }));
      },

      addComment: (postId, authorId, authorName, content, parentId) => {
        const newComment: CommentData = {
          id: `comm_${Math.random().toString(36).substr(2, 9)}`,
          postId,
          authorId,
          authorName,
          content: content.trim(),
          timestamp: new Date().toISOString(),
          upvotes: 0,
          downvotes: 0,
          depth: parentId ? 1 : 0,
          parentId,
        };

        set(state => {
          const allComments = state.comments || {};
          const postComments = allComments[postId] || [];
          const allPosts = state.posts || [];

          const updatedPosts = allPosts.map(p =>
            p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
          );

          return {
            comments: { ...allComments, [postId]: [...postComments, newComment] },
            posts: updatedPosts,
          };
        });
      },

      votePost: (postId, userId, type) => {
        set(state => {
          const allPosts = state.posts || [];
          return {
            posts: allPosts.map(post => {
              if (post.id !== postId) return post;

              const votedUsers = post.votedUsers || {};
              const userVote = votedUsers[userId];
              let { upvotes, downvotes } = post;
              const newVotedUsers = { ...votedUsers };

              if (userVote === type) {
                delete newVotedUsers[userId];
                if (type === 'up') upvotes--;
                else downvotes--;
              } else {
                if (userVote) {
                  if (userVote === 'up') upvotes--;
                  else downvotes--;
                }
                newVotedUsers[userId] = type;
                if (type === 'up') upvotes++;
                else downvotes++;
              }

              return { ...post, upvotes, downvotes, votedUsers: newVotedUsers };
            }),
          };
        });
      },

      clearAllDiscussions: async () => {
        await useDiscussionStore.persist.clearStorage();
        set({
          posts: INITIAL_POSTS || [],
          comments: INITIAL_COMMENTS || {},
        });
      },
    }),
    {
      name: 'discussion-app-storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);
