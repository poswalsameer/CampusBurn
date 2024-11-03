package comments

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO ADD COMMENT TO ANY POST:
-------------------------------
1. First check the auth status of the user, only logged in users can comment.
2. From req, we will get { postId, commentContent, userId }.
3. Check if this post exists or not, and return err response if not.
4. Check if the user exists or not, and return err response if not.
5. If everything is fine, create the comment.
6. Handle the errors carefully.


*/

func AddComment(c *fiber.Ctx) error {

	userId, ok := c.Locals("userId").(string)

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Error": "Unauthorized user while adding comment",
		})
	}

	var comment model.Comment
	if parsingError := c.BodyParser(&comment); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Invalid request body",
		})
	}

	if comment.CommentContent == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Comment body cannot be empty",
		})
	}

	var post model.Post
	postSearchError := dbConnection.DB.Where("ID = ?", comment.PostID).First(&post).Error
	if postSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "Cannot find the post while adding comment",
		})
	}

	var user model.User
	userSearchError := dbConnection.DB.Where("Email = ?", userId).First(&user).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "Cannot find the user while adding comment",
		})
	}

	comment.CreatedAt = time.Now()
	comment.UpdatedAt = time.Now()
	comment.PostID = post.ID
	comment.UserID = user.ID
	comment.LikeCount = 0
	comment.DislikeCount = 0

	commentCreationError := dbConnection.DB.Create(&comment).Error

	if commentCreationError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while adding the comment",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"Message": "Comment added successfully",
		"Comment": comment.CommentContent,
		"Post":    post.ID,
		"User":    user.ID,
	})

}
