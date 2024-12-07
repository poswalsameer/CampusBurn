package comments

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO DISLIKE A COMMENT:
-----------------------
1. Check auth status, cannot like a comment without login
2. parse the incoming body - req should have - { commentId }
3. Find the comment with this Id, if not found return err response
4. If found, increment the dislikeCount of this comment, and return response

*/

func DislikeComment(c *fiber.Ctx) error {

	_, ok := c.Locals("userId").(string)

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Message": "Unauthorized user while disliking the comment",
		})
	}

	var comment model.Comment
	if parsingError := c.BodyParser(&comment); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Invalid request body",
		})
	}

	commentSearchError := dbConnection.DB.Where("ID = ?", comment.ID).First(&comment).Error
	if commentSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "Comment not found",
		})
	}

	comment.DislikeCount = comment.DislikeCount + 1

	commentSaveError := dbConnection.DB.Save(&comment).Error
	if commentSaveError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while saving the comment after disliking",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":             "Dislike added to the comment successfully",
		"Disliked comment ID": comment.ID,
	})

}
