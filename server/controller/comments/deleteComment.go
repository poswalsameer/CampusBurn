package comments

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO DELETE A COMMENT:
------------------------
1. First check the auth status
2. Find the comment in the db
3. Verify the userId from the req with the actual userId in the comment's db
4. Return response after deleting the comment

*/

func DeleteComment(c *fiber.Ctx) error {

	userId, ok := c.Locals("userId").(string)

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Message": "Unauthorized user while editing the comment",
		})
	}

	var comment model.Comment
	if parsingError := c.BodyParser(&comment); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Invalid request body",
		})
	}

	var currentComment model.Comment
	commentSearchError := dbConnection.DB.Where("ID = ?", comment.ID).First(&currentComment).Error
	if commentSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "Comment to delete not found",
		})
	}

	var currentUser model.User
	userSearchError := dbConnection.DB.Where("Email = ?", userId).First(&currentUser).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "User not found while deleting the comment",
		})
	}

	var checkID = comment.UserID == currentUser.ID

	if !checkID {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"Message": "Comment can only be deleted by the user who created it",
		})
	}

	commentDeleteError := dbConnection.DB.Where("ID = ?", currentComment.ID).Delete(&currentComment).Error
	if commentDeleteError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while deleting the comment",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"Message":            "Comment deleted successfully",
		"Deleted comment ID": currentComment.ID,
		"Comment deleted by": currentUser.ID,
	})

}
