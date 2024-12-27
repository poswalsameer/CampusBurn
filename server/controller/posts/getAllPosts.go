package posts

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO GET ALL THE POSTS:
--------------------------
1. Create a variable array to store the posts.
2. Get all the posts from the database.
3. If any error while finding the posts, then return error response.
4. Return the success response with all posts as the data.
*/

type AllPostsResponseType struct {
	Comments     []model.Comment
	Content      string
	CreatedAt    time.Time
	DislikeCount uint64
	Id           uint
	LikeCount    uint64
	UpdatedAt    time.Time
	User         UserResponseType
}

type UserResponseType struct {
	Email        string
	Id           uint
	ProfilePhoto string
	Username     string
}

func GetAllPosts(c *fiber.Ctx) error {

	var allPostsFromDB []model.Post

	if allPostsFromDBResponse := dbConnection.DB.Preload("User").Preload("Comments").Find(&allPostsFromDB); allPostsFromDBResponse.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while fetching the posts",
		})
	}

	var allPosts []AllPostsResponseType

	for _, post := range allPostsFromDB {

		allPosts = append(allPosts, AllPostsResponseType{
			Comments:     post.Comments,
			Content:      post.Content,
			CreatedAt:    post.CreatedAt,
			DislikeCount: post.DislikeCount,
			Id:           post.ID,
			LikeCount:    post.LikeCount,
			UpdatedAt:    post.UpdatedAt,
			User: UserResponseType{
				Email:        post.User.Email,
				Id:           post.User.ID,
				ProfilePhoto: post.User.ProfilePhoto,
				Username:     post.User.Username,
			},
		})

	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Posts fetched successfully",
		"data":    allPosts,
	})

}
