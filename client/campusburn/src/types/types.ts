interface Post {
    Comments: any[];
    Content: string;
    CreatedAt: Date;
    DislikeCount: number;
    Id: number;
    LikeCount: number;
    UpdatedAt: Date;
    User: UserPost;
}

interface CurrentUser {
    id: number | undefined;
    email: string;
    username: string;
    profilePhoto: string;
    posts: any[]; //TODO:Need to create type for this
    comments: any[]; //TODO:Need to create type for this
    createdAt: Date;
}

interface CurrentUserWithoutPostAndComment {
    id: number | undefined;
    email: string;
    username: string;
    profilePhoto: string;
    createdAt: Date;
}

interface UserPost {
    Email: string;
    Id: number;
    ProfilePhoto: string;
    Username: string;
}

interface Comments {
    CommentContent: string;
    Id: number;
    CreatedAt: Date;
    DislikeCount: number;
    LikeCount: number;
    PostId: number;
    User: UserPost;
}

export type { Post, CurrentUser, CurrentUserWithoutPostAndComment, UserPost, Comments }