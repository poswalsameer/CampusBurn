package posts

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"sort"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO GET TOP 10 POSTS FROM THE DATABASE:
------------------------------------------
1. Get all posts from the database
2. Sort the posts by the number of likes
3. Return the top 10 posts
*/

type GetTopPostsResponseType struct {
	PostId       uint                        `json:"postId"`
	Content      string                      `json:"content"`
	CreatedAt    time.Time                   `json:"createdAt"`
	UserId       uint                        `json:"userId"`
	User         GetTopPostsUserResponseType `json:"user"`
	LikeCount    uint64                      `json:"likeCount"`
	DislikeCount uint64                      `json:"dislikeCount"`
	CommentCount uint64                      `json:"commentCount"`
}

type GetTopPostsUserResponseType struct {
	UserId       uint   `json:"userId"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	ProfilePhoto string `json:"profilePhoto"`
}

func GetTopPosts(c *fiber.Ctx) error {

	var posts []model.Post
	if err := dbConnection.DB.Preload("Comments").Preload("User").Find(&posts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while fetching posts from the database",
		})
	}

	// Sort posts by the number of likes in descending order
	sort.Slice(posts, func(i, j int) bool {
		if posts[i].LikeCount == posts[j].LikeCount {
			if posts[i].DislikeCount == posts[j].DislikeCount {
				return len(posts[i].Comments) > len(posts[j].Comments)
			}
			return posts[i].DislikeCount < posts[j].DislikeCount
		}
		return posts[i].LikeCount > posts[j].LikeCount
	})

	// Get the top 10 posts
	if len(posts) > 10 {
		posts = posts[:10]
	}

	var topPosts []GetTopPostsResponseType
	for _, post := range posts {
		topPosts = append(topPosts, GetTopPostsResponseType{
			PostId:    post.ID,
			Content:   post.Content,
			CreatedAt: post.CreatedAt,
			UserId:    post.UserID,
			User: GetTopPostsUserResponseType{
				UserId:       post.User.ID,
				Username:     post.User.Username,
				Email:        post.User.Email,
				ProfilePhoto: post.User.ProfilePhoto,
			},
			LikeCount:    post.LikeCount,
			DislikeCount: post.DislikeCount,
			CommentCount: uint64(len(post.Comments)),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"TopPosts": topPosts,
	})
}
