import { Post } from '@/types/types'
import { create } from 'zustand'

interface PostStore {
    Post: Post
}

const postStore = create<any>()((set) => ({
    //states
    posts: [],

    //methods
    setPosts: (newPosts: any[]) => set({ posts: newPosts }),
}))

export { postStore }