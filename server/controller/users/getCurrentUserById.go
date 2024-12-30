package users

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO FETCH THE CURRENT USER WITH ID:
--------------------------------------
1. Check the userId sent in response, if not right, then return error response.
2. Find the user in DB with this ID.
3. If error, then returne error response.
4. Else, return the user details in an object.


*/

type GetCurrentUserByIdRequest struct {
	UserId uint `json:"userId"`
}

type GetCurrentUserByIdResponse struct {
	Id           uint
	Email        string
	Username     string
	ProfilePhoto string
	// Posts        []model.Post
	// Comments     []model.Comment
	CreatedAt time.Time
}

func GetCurrentUserById(c *fiber.Ctx) error {

	var userId GetCurrentUserByIdRequest

	if err := c.BodyParser(&userId); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Invalid request body",
		})
	}

	if userId.UserId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "User ID is required and cannot be zero",
		})
	}

	var currentUser model.User
	if userSearchError := dbConnection.DB.Where("ID = ?", userId.UserId).First(&currentUser); userSearchError.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while finding the current user",
		})
	}

	var currentUserById GetCurrentUserByIdResponse

	currentUserById.Id = currentUser.ID
	currentUserById.Email = currentUser.Email
	currentUserById.Username = currentUser.Username
	currentUserById.ProfilePhoto = currentUser.ProfilePhoto
	currentUserById.CreatedAt = currentUser.CreatedAt

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":     "Details of the current user",
		"CurrentUser": currentUserById,
	})

}
