package controller

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO ADD LIKE TO THE DB:
--------------------------
1. Get the post Id from the request.
2. Find this post from the Id in the database.
3. If post found, then increase the like count.

*/

func AddLike(c *fiber.Ctx) error {

	var post model.Post
	if parsingError := c.BodyParser(&post); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Invalid request body",
		})
	}

	var thisPost model.Post
	searchPostError := dbConnection.DB.Where("ID = ?", post.ID).First(&thisPost).Error

	if searchPostError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": "Post not found in the DB",
		})
	}

	thisPost.LikeCount = thisPost.LikeCount + 1

	postSaveError := dbConnection.DB.Save(&thisPost).Error
	if postSaveError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while saving the like count in database",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"Message":    "Like added successfully",
		"Like count": thisPost.LikeCount,
	})

}
