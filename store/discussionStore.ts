import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostData, CommentData } from '../data/discussionMockData';
import { apiClient, BASE_URL } from '../api/apiClient';
import { sanitizeText } from '../utils/security';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = BASE_URL.replace('/api', '');

interface DiscussionState {
  posts: PostData[];
  comments: Record<string, CommentData[]>;
  isLoading: boolean;
  socket: Socket | null;
  fetchPosts: () => Promise<void>;
  getPostById: (id: string) => PostData | undefined;
  getCommentsByPostId: (postId: string) => CommentData[];
  addPost: (
    post: Omit<
      PostData,
      'id' | 'timestamp' | 'upvotes' | 'downvotes' | 'commentCount' | 'votedUsers'
    >
  ) => Promise<void>;
  addComment: (
    postId: string,
    userId: string,
    userName: string,
    content: string
  ) => Promise<void>;
  fetchComments: (postId: string) => Promise<CommentData[]>;
  votePost: (postId: string, type: 'up' | 'down') => Promise<void>;
  clearAllDiscussions: () => Promise<void>;
  initSocket: (postId: string) => void;
  disconnectSocket: (postId: string) => void;
}

export const useDiscussionStore = create<DiscussionState>()(
  persist(
    (set, get) => ({
      posts: [],
      comments: {},
      isLoading: false,
      socket: null,

      initSocket: postId => {
        let socket = get().socket;
        if (!socket) {
          socket = io(SOCKET_URL, { transports: ['websocket'] });
          set({ socket });
        }

        socket.emit('join_post', { postId });

        socket.on('new_comment', (comment: CommentData) => {
          const currentComments = get().comments[postId] || [];
          if (currentComments.some(c => c.id === comment.id)) return;

          set(state => ({
            comments: {
              ...state.comments,
              [postId]: [...currentComments, comment],
            },
            posts: state.posts.map(p =>
              p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
            ),
          }));
        });

        socket.on('vote_update', (data: any) => {
          set(state => ({
            posts: state.posts.map(p =>
              p.id === data.postId
                ? {
                    ...p,
                    upvotes: data.upvotes,
                    downvotes: data.downvotes,
                    votedUsers: data.votedUsers,
                  }
                : p
            ),
          }));
        });
      },

      disconnectSocket: postId => {
        const socket = get().socket;
        if (socket) {
          socket.emit('leave_post', { postId });
          socket.off('new_comment');
          socket.off('vote_update');
        }
      },

      fetchPosts: async () => {
        try {
          set({ isLoading: true });
          const data = await apiClient('posts', { method: 'GET' });
          set({ posts: data, isLoading: false });
        } catch (e: any) {
          set({ isLoading: false });
        }
      },

      getPostById: id => get().posts.find(p => p.id === id),
      getCommentsByPostId: postId => get().comments[postId] || [],

      addPost: async data => {
        await apiClient('posts', {
          method: 'POST',
          body: JSON.stringify({ ...data, content: sanitizeText(data.content) }),
        });
        await get().fetchPosts();
      },

      addComment: async (postId, userId, userName, content) => {
        await apiClient(`posts/${postId}/comments`, {
          method: 'POST',
          body: JSON.stringify({ content: sanitizeText(content.trim()) }),
        });
      },

      fetchComments: async postId => {
        try {
          const data = await apiClient(`posts/${postId}/comments`, { method: 'GET' });
          set(state => ({ comments: { ...state.comments, [postId]: data } }));
          return data;
        } catch (e: any) {
          return [];
        }
      },

      votePost: async (postId, type) => {
        try {
          await apiClient(`posts/${postId}/vote`, {
            method: 'POST',
            body: JSON.stringify({ type }),
          });
        } catch (e: any) {}
      },

      clearAllDiscussions: async () => {
        set({ posts: [], comments: {} });
      },
    }),
    {
      name: 'discussion-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ posts: state.posts, comments: state.comments }),
    }
  )
);
