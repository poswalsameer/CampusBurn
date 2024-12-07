package posts

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO DELETE ANY POST:
------------------------
1. First check the auth status of the user, if not authenticated, then return err.
2. Then check, if the user deleting this post, the id of in the schema of this post should match with the id of the user.
3. If does not matches, then return error response.
4. Delete the post from the database.
5. Return ok response.

*/

/*

THINGS REQUIRED FROM THE FRONTEND TO DELETE A POST:
1. Post ID
2. Content
3. UserID of the user with whom this post is associated.

*/

func DeletePost(c *fiber.Ctx) error {

	userId, ok := c.Locals("userId").(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Error": "Unauthorized user in the delete post controller",
		})
	}

	// FINDING THE USER IN THE DB
	var currentUser model.User
	userSearchErr := dbConnection.DB.Where("Email = ?", userId).First(&currentUser).Error
	if userSearchErr != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": userSearchErr.Error(),
		})
	}

	var post model.Post
	// CHECKING IF THE INCOMING DATA FROM THE REQUEST IS OKAY OR NOT
	if parsingError := c.BodyParser(&post); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Invalid request body",
		})
	}

	var checkID = currentUser.ID == post.UserID

	if !checkID {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"Error": "This post is can only be deleted by the user who created it",
		})
	}

	// FINDING THIS POST_ID IN THE DATABASE
	deletePostErr := dbConnection.DB.Where("ID = ?", post.ID).Delete(&post).Error
	if deletePostErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while deleting the post",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Post deleted successfully",
	})

}
