package comments

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO EDIT COMMENT OF A USER:
------------------------------
1. First check the auth status.
2. The req body will have { commentId, userId, newComment }
3. Find this comment, if DNE, then return err res.
4. If exists, find the userId, if not same with the req body userId, return err
5. If same, edit the comment, and return response.
*/

func EditComment(c *fiber.Ctx) error {

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
			"Message": "Comment to edit not found in the DB",
		})
	}

	var currentUser model.User
	userSearchError := dbConnection.DB.Where("Email = ?", userId).First(&currentUser).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "User not found in the DB",
		})
	}

	var checkID = comment.UserID == currentUser.ID

	if !checkID {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"Message": "Comment can only be edited by the user who created it",
		})
	}

	currentComment.CommentContent = comment.CommentContent
	currentComment.UpdatedAt = time.Now()

	commentSaveError := dbConnection.DB.Save(&currentComment).Error
	if commentSaveError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while saving the comment in the DB",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":   "Comment edited successfully",
		"Edited by": currentUser.ID,
	})

}
