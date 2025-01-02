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

type DislikeCommentRequest struct {
	CommentId uint `json:"commentId"`
	UserId    uint `json:"userId"`
}

func DislikeComment(c *fiber.Ctx) error {

	var req DislikeCommentRequest

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

	var currentComment model.Comment
	commentSearchError := dbConnection.DB.Where("ID = ?", req.CommentId).First(&currentComment).Error
	if commentSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "Comment not found in the DB",
		})
	}

	// SEARCH THE USER IN THE DB
	var currentUser model.User
	userSearchError := dbConnection.DB.Where("ID = ?", req.UserId).First(&currentUser).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "User not found in the DB",
		})
	}

	//CHECKING IF THE USER HAS ALREADY DISLIKED THE COMMENT
	for _, user := range currentComment.DislikedByUsers {
		if user.ID == currentUser.ID {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"Message": "User has already disliked the comment",
			})
		}
	}

	// ADDING THE USER TO THE LIST OF DISLIKES
	if err := dbConnection.DB.Model(&currentComment).Association("DislikedByUsers").Append(&currentUser); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while adding user to the list of comment dislikes",
		})
	}

	currentComment.DislikeCount = currentComment.DislikeCount + 1

	commentSaveError := dbConnection.DB.Save(&currentComment).Error
	if commentSaveError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while saving the comment after disliking",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":             "Dislike added to the comment successfully",
		"Disliked comment ID": currentComment.ID,
		"Disliked by":         currentUser.ID,
	})

}
