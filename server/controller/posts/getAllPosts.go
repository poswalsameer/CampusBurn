package posts

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO GET ALL THE POSTS:
--------------------------
1. Create a variable array to store the posts.
2. Get all the posts from the database.
3. If any error while finding the posts, then return error response.
4. Return the success response with all posts as the data.
*/

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
