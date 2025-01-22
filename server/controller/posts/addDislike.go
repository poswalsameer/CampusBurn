package posts

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

type AddDislikeRequest struct {
	PostId uint `json:"postId"`
	UserId uint `json:"userId"`
}

type RemovePostDislikeRequest struct {
	PostId uint `json:"postId"`
	UserId uint `json:"userId"`
}

func AddDislike(c *fiber.Ctx) error {

	var req AddDislikeRequest

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
	searchPostError := dbConnection.DB.Preload("DislikedByUsers").Where("ID = ?", req.PostId).First(&currentPost).Error
	if searchPostError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": "Post not found in the DB",
		})
	}

	//FIND THE USER
	var currentUser model.User
	userSearchError := dbConnection.DB.Where("ID = ?", req.UserId).First(&currentUser).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "User not found in the DB",
		})
	}

	// CHECK IF THE USER HAS ALREADY DISLIKED THE POST
	for _, user := range currentPost.DislikedByUsers {
		if user.ID == currentUser.ID {
			var removeReq RemovePostDislikeRequest
			removeReq.PostId = req.PostId
			removeReq.UserId = req.UserId

			// Create new context with the remove request body
			c.Context().SetBody(c.Body())
			return RemovePostDislike(c)
		}
	}

	// ADD THE USER TO THE DISLIKED BY LIST
	if err := dbConnection.DB.Model(&currentPost).Association("DislikedByUsers").Append(&currentUser); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while adding the user to the disliked by list",
		})
	}

	currentPost.DislikeCount = currentPost.DislikeCount + 1

	savePostError := dbConnection.DB.Save(&currentPost).Error
	if savePostError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while saving the post in the DB",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":      "Dislike added successfully",
		"DislikeCount": currentPost.DislikeCount,
		"Disliked by":  currentUser.ID,
	})

}

func RemovePostDislike(c *fiber.Ctx) error {

	var req RemovePostDislikeRequest

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

	// SEARCH THE USER IN THE DB
	var currentUser model.User
	userSearchError := dbConnection.DB.Where("ID = ?", req.UserId).First(&currentUser).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "User not found in the DB",
		})
	}

	//CHECK IF THE USER HAS ALREADY REMOVED DISLIKE FROM THE POST
	for _, user := range currentPost.DislikedByUsers {
		if user.ID != currentUser.ID {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"Message": "User has already removed dislike from the post",
			})
		}
	}

	// DELETING THE USER FROM THE LIST OF DISLIKES OF POST
	if err := dbConnection.DB.Model(&currentPost).Association("DislikedByUsers").Delete(&currentUser); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while removing user from the list of dislikes",
		})
	}

	currentPost.DislikeCount = currentPost.DislikeCount - 1

	postSaveError := dbConnection.DB.Save(&currentPost).Error
	if postSaveError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while saving the like count in database",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":             "Dislike removed successfully",
		"DislikeCount":        currentPost.DislikeCount,
		"Disliked removed by": currentUser.ID,
	})
}
