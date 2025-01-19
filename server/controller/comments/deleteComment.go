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

type DeleteCommentRequestType struct {
	CommentId uint `json:"commentId"`
	UserId    uint `json:"userId"`
}

func DeleteComment(c *fiber.Ctx) error {

	// userId, ok := c.Locals("userId").(string)

	// if !ok {
	// 	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
	// 		"Message": "Unauthorized user while editing the comment",
	// 	})
	// }

	token := c.Cookies("token")
	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Message": "Unauthorized user, please log in",
		})
	}

	var req DeleteCommentRequestType
	if parsingError := c.BodyParser(&req); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Invalid request body",
		})
	}

	if req.CommentId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Wrong comment ID entered",
		})
	}
	if req.UserId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Wrong user ID entered",
		})
	}

	// Find the comment with this ID
	var currentComment model.Comment
	commentSearchError := dbConnection.DB.Where("ID = ?", req.CommentId).First(&currentComment).Error
	if commentSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "Comment to delete not found",
		})
	}

	//Finding the user with this ID
	var currentUser model.User
	userSearchError := dbConnection.DB.Where("ID = ?", req.UserId).First(&currentUser).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "User not found while deleting the comment",
		})
	}

	var checkID = currentComment.UserID == currentUser.ID

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

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":            "Comment deleted successfully",
		"Deleted comment ID": currentComment.ID,
		"Comment deleted by": currentUser.ID,
	})

}
