export interface Post {
    Comments: any[];
    Content: string;
    CreatedAt: Date;
    DislikeCount: number;
    Id: number;
    LikeCount: number;
    UpdatedAt: Date;
    User: UserPost;
}

export interface CurrentUser {
    id: number | undefined;
    email: string;
    username: string;
    profilePhoto: string;
    posts: any[]; //TODO:Need to create type for this
    comments: any[]; //TODO:Need to create type for this
    createdAt: Date;
}

export interface UserPost {
    Email: string;
    Id: number;
    ProfilePhoto: string;
    Username: string;
}