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
3. UserID of the user with whom this post is associated.

*/

type DeletePostRequest struct {
	PostId uint `json:"postId"`
	UserId uint `json:"userId"`
}

func DeletePost(c *fiber.Ctx) error {

	token := c.Cookies("token")
	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Message": "Unauthorized user, please log in",
		})
	}

	var req DeletePostRequest
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

	// FINDING THE USER IN THE DB
	var currentUser model.User
	userSearchErr := dbConnection.DB.Where("ID = ?", req.UserId).First(&currentUser).Error
	if userSearchErr != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": userSearchErr.Error(),
		})
	}

	//FIND THE POST WITH THE ID
	var currentPost model.Post
	postSearchError := dbConnection.DB.Where("ID = ?", req.PostId).First(&currentPost).Error
	if postSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "Post not found with this ID",
		})
	}

	var checkID = currentUser.ID == currentPost.UserID

	if !checkID {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"Error": "This post can only be deleted by the user who created it",
		})
	}

	// First delete all comments associated with this post
	deleteCommentsErr := dbConnection.DB.Where("post_id = ?", currentPost.ID).Delete(&model.Comment{}).Error
	if deleteCommentsErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while deleting comments for this post",
		})
	}

	// Then delete the post itself
	deletePostErr := dbConnection.DB.Where("ID = ?", currentPost.ID).Delete(&currentPost).Error
	if deletePostErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while deleting the post",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Post deleted successfully",
	})

}
