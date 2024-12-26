package posts

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO CREATE POST BY THE USER
-------------------------------
1. First check the auth status of the user. ( done using jwt token and middleware )
2. If not logged into the application, then send error and return.
3. Then get the body from the req by the client.
4. Make sure that the description is not empty, if empty then return error response.
5. Set likeCount and dislikeCount to 0 by default.
6. Get the ID of the user from the database using email we got from cookies
6. Save this post into the database and also in the table of the user who created this post.
7. Handle all the errors gracefully and return response accordingly.
*/

func CreatePost(c *fiber.Ctx) error {

	// userId, ok := c.Locals("userId").(string)

	// if !ok {
	// 	c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
	// 		"Error": "Unauthorized user, cannot create a post",
	// 	})
	// }

	// fmt.Println("The user trying to create this post is: ", userId)

	token := c.Cookies("token")

	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Message": "Unauthorized user, log in",
		})
	}

	var post model.Post

	// CHECKING IF THE INCOMING DATA FROM THE REQUEST IS OKAY OR NOT
	if parsingError := c.BodyParser(&post); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Invalid request body",
		})
	}

	if post.Content == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Body of the post cannot be empty",
		})
	}

	// FIND THE ID OF THE USER WITH EMAIL AS userId
	var user model.User
	userSearchError := dbConnection.DB.Where("auth_token = ?", token).First(&user).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": userSearchError.Error(),
		})
	}

	// SETTING THE VALUES INSIDE THE POST
	post.UserID = user.ID
	post.CreatedAt = time.Now()
	post.UpdatedAt = time.Now()
	post.LikeCount = 0
	post.DislikeCount = 0

	// SAVING THE POST TO THE DATABASE
	postSaveError := dbConnection.DB.Create(&post).Error

	if postSaveError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error":  "Error while creating this post",
			"Detail": postSaveError.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Post Created",
		"Post":    post.Content,
		"Creator": user.Email,
	})

}
