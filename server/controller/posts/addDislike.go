package posts

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

func AddDislike(c *fiber.Ctx) error {

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

	thisPost.DislikeCount = thisPost.DislikeCount + 1

	savePostError := dbConnection.DB.Save(&thisPost).Error
	if savePostError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while saving the post in the DB",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":       "Dislike added successfully",
		"Dislike count": thisPost.DislikeCount,
	})

}
