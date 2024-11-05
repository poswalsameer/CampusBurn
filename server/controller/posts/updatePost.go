package posts

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO UPDATE THE POST OF ANY USER:
-----------------------------------
1. First check the auth status of the user, if not authenticated, then return err.
2. Then validate the new data incoming from the req, if empty, then also return err.
3. Find the user associated with this post, if user is not the same, then return err.
4. If user is same, then update the post, handle errors gracefully.
5. Return final response accordingly after update.
*/

func UpdatePost(c *fiber.Ctx) error {

	userId, ok := c.Locals("userId").(string)

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Error": "User not authorized to perform this action",
		})
	}

	// FINDING THE USER WITH THIS userId
	var userInDB model.User
	userSearchErr := dbConnection.DB.Where("Email = ?", userId).First(&userInDB).Error
	if userSearchErr != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": "User not found in DB with this email address",
		})
	}

	var currentPost model.Post
	if parsingError := c.BodyParser(&currentPost); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Invalid request body",
		})
	}

	// VALIDATING THE INCOMING DATA
	if currentPost.Content == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "The content of the post cannot be left empty",
		})
	}

	var postInDB model.Post
	findPostError := dbConnection.DB.Where("ID = ?", currentPost.ID).First(&postInDB).Error
	if findPostError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": "Post not found",
		})
	}

	var checkID = postInDB.UserID == userInDB.ID

	if !checkID {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": "The post can only be updated by the user who created it",
		})
	}

	postInDB.Content = currentPost.Content
	postInDB.UpdatedAt = time.Now()

	postSaveError := dbConnection.DB.Save(&postInDB).Error
	if postSaveError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Issue while saving the post after updating it",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"Message":      "Post updated successfully",
		"Updated by":   userInDB.Email,
		"Updated post": postInDB.Content,
	})

}
