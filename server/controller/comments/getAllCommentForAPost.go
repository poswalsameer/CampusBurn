package comments

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

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
	CommentId      uint             `json:"commentId"`
	CommentContent string           `json:"commentContent"`
	CreatedAt      string           `json:"createdAt"`
	PostId         uint             `json:"postId"`
	LikeCount      uint64           `json:"likeCount"`
	DislikeCount   uint64           `json:"dislikeCount"`
	User           UserResponseType `json:"user"`
}

type UserResponseType struct {
	UserId       uint   `json:"userId"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	ProfilePhoto string `json:"profilePhoto"`
}

type RequestBody struct {
	PostId uint `json:"postId"`
}

func GetAllCommentForAPost(c *fiber.Ctx) error {

	var reqBody RequestBody

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

	var response []AllCommentsResponseType

	for _, comment := range comments {
		response = append(response, AllCommentsResponseType{
			CommentId:      comment.ID,
			CommentContent: comment.CommentContent,
			CreatedAt:      comment.CreatedAt.Format("2006-01-02"),
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
		"Message": "Comments fetched successfully",
		"data":    response,
	})
}
