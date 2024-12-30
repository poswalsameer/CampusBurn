package comments

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO GET ALL THE COMMENTS FOR A POST:
---------------------------------------
1. Get the post Id from the request.
2. Find all the comments for this post from the database.
3. If any error while finding the comments, then return error response.
4. Return the success response with all comments as the data.

*/

type AllCommentsResponseType struct {
	CommentId      uint
	CommentContent string
	CreatedAt      time.Time
	PostId         uint
	LikeCount      uint64
	DislikeCount   uint64
	User           UserResponseType
}

type UserResponseType struct {
	UserId       uint
	Username     string
	Email        string
	ProfilePhoto string
}

type GetAllCommentsForAPostRequest struct {
	PostId uint `json:"postId"`
}

func GetAllCommentForAPost(c *fiber.Ctx) error {

	var reqBody GetAllCommentsForAPostRequest

	if parsingError := c.BodyParser(&reqBody); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Invalid request body",
		})
	}

	if reqBody.PostId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Post id is required",
		})
	}

	postId := reqBody.PostId

	var comments []model.Comment

	commentSearchError := dbConnection.DB.Preload("User").Where("post_id = ?", postId).Find(&comments).Error
	if commentSearchError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while fetching the comments for the post",
		})
	}

	var allCommentForThisPost []AllCommentsResponseType

	for _, comment := range comments {
		allCommentForThisPost = append(allCommentForThisPost, AllCommentsResponseType{
			CommentId:      comment.ID,
			CommentContent: comment.CommentContent,
			CreatedAt:      comment.CreatedAt,
			PostId:         comment.PostID,
			LikeCount:      comment.LikeCount,
			DislikeCount:   comment.DislikeCount,
			User: UserResponseType{
				UserId:       comment.User.ID,
				Username:     comment.User.Username,
				Email:        comment.User.Email,
				ProfilePhoto: comment.User.ProfilePhoto,
			},
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":  "Comments fetched successfully",
		"Comments": allCommentForThisPost,
	})
}
