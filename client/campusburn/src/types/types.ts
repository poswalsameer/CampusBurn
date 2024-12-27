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

export interface UserPost {
    Email: string;
    Id: number;
    ProfilePhoto: string;
    Username: string;
}