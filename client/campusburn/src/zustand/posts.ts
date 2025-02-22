import { create } from 'zustand'

const postStore = create<any>()((set) => ({
    //states
    posts: [],

    //methods
    setPosts: (newPosts: any[]) => set({ posts: newPosts }),
}))

export { postStore }