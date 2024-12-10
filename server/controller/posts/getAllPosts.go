package posts

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

func GetAllPosts(c *fiber.Ctx) error {

	var allPosts []model.Post

	if allPostsResponse := dbConnection.DB.Find(&allPosts); allPostsResponse.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while fetching the posts",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Posts fetched successfully",
		"data":    allPosts,
	})

}
