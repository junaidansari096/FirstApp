import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface PostsState {
  // Feed list state
  feedPosts: Post[];
  page: number;
  limit: number;
  hasMore: boolean;
  searchQuery: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  refreshing: boolean;
  error: string | null;

  // Favorites state
  favorites: Post[];

  // Cache for offline restore
  cachedFeed: Post[];

  // Comments state for detailed view
  comments: Comment[];
  commentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  commentsError: string | null;
}

const initialState: PostsState = {
  feedPosts: [],
  page: 1,
  limit: 15,
  hasMore: true,
  searchQuery: '',
  status: 'idle',
  refreshing: false,
  error: null,
  
  favorites: [],
  cachedFeed: [],

  comments: [],
  commentsStatus: 'idle',
  commentsError: null,
};

// Thunk to fetch posts from the API with pagination and search query
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page, limit, query, isRefresh = false }: { page: number; limit: number; query: string; isRefresh?: boolean }, thunkAPI) => {
    try {
      const url = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}&q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = (await response.json()) as Post[];
      
      // JSONPlaceholder doesn't return headers for total items easily in typical fetch, 
      // but if the length returned is less than limit, we know we've reached the end.
      const hasMore = data.length === limit;
      return { posts: data, page, isRefresh, hasMore };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// Thunk to fetch comments for a specific post
export const fetchComments = createAsyncThunk(
  'posts/fetchComments',
  async (postId: number, thunkAPI) => {
    try {
      const url = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return (await response.json()) as Comment[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Could not load comments');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 1;
      state.hasMore = true;
      state.status = 'idle'; // Reset status to trigger fetch
    },
    incrementPage(state) {
      state.page += 1;
    },
    toggleFavorite(state, action: PayloadAction<Post>) {
      const post = action.payload;
      const index = state.favorites.findIndex(item => item.id === post.id);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(post);
      }
    },
    clearComments(state) {
      state.comments = [];
      state.commentsStatus = 'idle';
      state.commentsError = null;
    },
    // Hydrate store from AsyncStorage
    hydrateStore(state, action: PayloadAction<{ favorites?: Post[]; cachedFeed?: Post[]; searchQuery?: string }>) {
      if (action.payload.favorites) {
        state.favorites = action.payload.favorites;
      }
      if (action.payload.cachedFeed && action.payload.cachedFeed.length > 0) {
        state.cachedFeed = action.payload.cachedFeed;
        // If we have cached feed and feedPosts is empty, initialize feedPosts with cached data
        if (state.feedPosts.length === 0) {
          state.feedPosts = action.payload.cachedFeed;
        }
      }
      if (action.payload.searchQuery !== undefined) {
        state.searchQuery = action.payload.searchQuery;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state, action) => {
        if (action.meta.arg.isRefresh) {
          state.refreshing = true;
        } else {
          state.status = 'loading';
        }
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const { posts, page, isRefresh, hasMore } = action.payload;
        state.status = 'succeeded';
        state.refreshing = false;
        state.hasMore = hasMore;
        
        if (isRefresh || page === 1) {
          state.feedPosts = posts;
          state.page = 1;
          // Cache the first page of feed for offline load
          if (state.searchQuery === '') {
            state.cachedFeed = posts;
          }
        } else {
          // Append unique posts
          const existingIds = new Set(state.feedPosts.map(p => p.id));
          const newPosts = posts.filter(p => !existingIds.has(p.id));
          state.feedPosts = [...state.feedPosts, ...newPosts];
        }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.refreshing = false;
        state.error = action.payload as string;
      })
      
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.commentsStatus = 'loading';
        state.commentsError = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.commentsStatus = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.commentsStatus = 'failed';
        state.commentsError = action.payload as string;
      });
  },
});

export const { setSearchQuery, incrementPage, toggleFavorite, clearComments, hydrateStore } = postsSlice.actions;
export default postsSlice.reducer;
