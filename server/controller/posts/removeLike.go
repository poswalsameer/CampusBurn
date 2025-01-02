package posts

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

type RemoveLikeRequest struct {
	PostId uint `json:"postId"`
	UserId uint `json:"userId"`
}

func RemoveLike(c *fiber.Ctx) error {

	// var post model.Post
	// if parsingError := c.BodyParser(&post); parsingError != nil {
	// 	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
	// 		"Error": "Invalid request body",
	// 	})
	// }

	var req RemoveLikeRequest

	if parsingError := c.BodyParser(&req); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Invalid request body",
		})
	}

	if req.PostId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Wrong Post ID entered",
		})
	}

	var currentPost model.Post
	searchPostError := dbConnection.DB.Where("ID = ?", req.PostId).First(&currentPost).Error
	if searchPostError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": "Post not found in the DB",
		})
	}

	//SEARCH THE USER
	var currentUser model.User
	userSearchError := dbConnection.DB.Where("ID = ?", req.UserId).First(&currentUser).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "Cannot find the user in the DB",
		})
	}

	// CHECKING IF THE USER HAS ALREADY REMOVED LIKE FROM THE POST
	for _, user := range currentPost.LikedByUsers {
		if user.ID != currentUser.ID {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"Message": "User has already disliked the post",
			})
		}
	}

	// REMOVE THIS USER FROM THE LIST OF USER WHO HAVE LIKED THE POST
	if err := dbConnection.DB.Model(&currentPost).Association("LikedByUsers").Delete(&currentUser); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while removing the user from the list of users who have liked the post",
		})
	}

	currentPost.LikeCount = currentPost.LikeCount - 1

	postSaveError := dbConnection.DB.Save(&currentPost).Error
	if postSaveError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while saving the like count in database",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":          "Like removed successfully",
		"Like count":       currentPost.LikeCount,
		"Post disliked by": currentUser.ID,
	})

}
