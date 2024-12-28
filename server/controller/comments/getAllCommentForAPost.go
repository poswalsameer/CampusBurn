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

func GetAllCommentForAPost(c *fiber.Ctx) error {

	var post []model.Post
	var postId = c.Params("postId")

	postSearchError := dbConnection.DB.Where("ID = ?", postId).First(&post).Error
	if postSearchError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Post not found",
		})
	}

	var allComments []string

	commentSearchError := dbConnection.DB.Model(&model.Comment{}).Where("post_id = ?", postId).Pluck("comment_content", &allComments).Error
	if commentSearchError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while fetching the comments for the post",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Comments fetched successfully",
		"data":    allComments,
	})
}
