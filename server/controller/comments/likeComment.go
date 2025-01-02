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
4. If found, increment the likeCount of this comment, and return response

*/

// LIKE AND UNLIKE API WILL HIT CONDITIONALLY FROM THE FRONTEND THROUGH A boolean VARIABLE

type LikeCommentRequest struct {
	CommentId uint `json:"commentId"`
	UserId    uint `json:"userId"`
}

func LikeComment(c *fiber.Ctx) error {

	var req LikeCommentRequest

	if parsingError := c.BodyParser(&req); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Invalid request body",
		})
	}

	if req.CommentId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Wrong Comment ID entered",
		})
	}

	var currentComment model.Comment
	commentSearchError := dbConnection.DB.Where("ID = ?", req.CommentId).First(&currentComment).Error
	if commentSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "Comment not found in the DB",
		})
	}

	var currentUser model.User
	userSearchError := dbConnection.DB.Where("ID = ?", req.UserId).First(&currentUser).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "User not found in the DB",
		})
	}

	//CHECKING IF THE USER HAS ALREADY LIKED A COMMENT
	for _, user := range currentComment.LikedByUsers {
		if user.ID == currentUser.ID {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"Message": "User has already liked the comment",
			})
		}
	}

	// ADD THIS USER TO THE LIST OF LIKED COMMENTS BY USERS
	if err := dbConnection.DB.Model(&currentComment).Association("LikedByUsers").Append(&currentUser); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while adding the user to the list of liked comments",
		})
	}

	currentComment.LikeCount = currentComment.LikeCount + 1

	commentSaveError := dbConnection.DB.Save(&currentComment).Error
	if commentSaveError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while saving the comment after liking",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":          "Like added to the comment successfully",
		"Liked comment ID": currentComment.ID,
		"Comment liked by": currentUser.ID,
	})

}
