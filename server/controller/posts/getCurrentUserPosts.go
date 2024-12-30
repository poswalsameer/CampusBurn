package posts

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO GET ALL POSTS OF THE CURRENT USER:
------------------------------------------
1. First check if userId is undefined or not, if undefined then return error response.
2. Search the DB with this userId, and get all Posts of this user.
3. Store the posts in an array.const
4. Return this array in response.

*/

type UserId struct {
	UserId uint `json:"userId"`
}

type CurrentUserPostResponseType struct {
	Comments     []model.Comment
	Content      string
	CreatedAt    time.Time
	DislikeCount uint64
	Id           uint
	LikeCount    uint64
	UpdatedAt    time.Time
	User         UserResponseType
}

type CurrentUserResponseType struct {
	Email        string
	Id           uint
	ProfilePhoto string
	Username     string
}

func GetCurrentUserPosts(c *fiber.Ctx) error {

	var userId UserId

	if err := c.BodyParser(&userId); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Invalid request body",
		})
	}

	if userId.UserId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "User ID is required and cannot be zero",
		})
	}

	var currentUserPostsFromDB []model.Post

	if currentUserPostsFromDBError := dbConnection.DB.Preload("User").Preload("Comments").Where("user_id = ?", userId.UserId).Find(&currentUserPostsFromDB); currentUserPostsFromDBError.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Cannot find posts right now",
		})
	}

	var currentUserPosts []CurrentUserPostResponseType

	for _, post := range currentUserPostsFromDB {

		currentUserPosts = append(currentUserPosts, CurrentUserPostResponseType{
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
		"Message":          "Posts of the current user fetched successfully",
		"currentUserPosts": currentUserPosts,
	})

}
