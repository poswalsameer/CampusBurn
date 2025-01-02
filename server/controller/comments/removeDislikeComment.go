package comments

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO LIKE A COMMENT:
-----------------------
1. Check auth status, cannot like a comment without login
2. parse the incoming body - req should have - { commentId }
3. Find the comment with this Id, if not found return err response
4. If found, decrement the dislikeCount of this comment, and return response

*/

type RemoveDislikeCommentRequest struct {
	CommentId int `json:"commentId"`
	UserId    int `json:"userId"`
}

func RemoveDislikeComment(c *fiber.Ctx) error {

	var req RemoveDislikeCommentRequest
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
			"Message": "Comment not found",
		})
	}

	//SEARCHING THE USER IN THE DB
	var currentUser model.User
	userSearchError := dbConnection.DB.Where("ID = ?", req.UserId).First(&currentUser).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "User not found in the DB",
		})
	}

	//CHECKING IF THE USER HAS ALREADY REMOVED DISLIKE FROM THE COMMENT
	for _, user := range currentComment.DislikedByUsers {
		if user.ID != currentUser.ID {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"Message": "User has already removed dislike from the comment",
			})
		}
	}

	// REMOVING THE USER FROM THE LIST OF DISLIKES
	if err := dbConnection.DB.Model(&currentComment).Association("DislikedByUsers").Delete(&currentUser); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while removing the user from the list of dislikes",
		})
	}

	currentComment.DislikeCount = currentComment.DislikeCount - 1

	commentSaveError := dbConnection.DB.Save(&currentComment).Error
	if commentSaveError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while saving the comment after removing dislike",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":            "removed dislike from the comment successfully",
		"Comment ID":         currentComment.ID,
		"Dislike removed by": currentUser.ID,
	})

}
