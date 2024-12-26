package users

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO FIND THE CURRENT LOGGED IN USER
----------------------------------------
1. Find the token present inside the cookie.
2. Find the corresponding user associated with this token.
3. Return this user, if no error found else return the error.

*/

type CurrentToken struct {
	Token string `json:"token"`
}

type CurrentUserDetails struct {
	Email        string          `json:"email"`
	Username     string          `json:"username"`
	ProfilePhoto string          `json:"profilePhoto"`
	Posts        []model.Post    `json:"posts"`
	Comments     []model.Comment `json:"comments"`
	CreatedAt    time.Time       `json:"createdAt"`
}

func GetCurrentUser(c *fiber.Ctx) error {

	token := c.Cookies("token")

	if token == "" {
		var tokenInCookie CurrentToken
		err := c.BodyParser(&tokenInCookie)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"Error": "Invalid request body",
			})
		}
		token = tokenInCookie.Token
	}

	var currentUser model.User
	currentUserSearchError := dbConnection.DB.Where("auth_token = ?", token).First(&currentUser).Error
	if currentUserSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "User not found",
		})
	}

	var currentUserDetails CurrentUserDetails
	currentUserDetails.Email = currentUser.Email
	currentUserDetails.Username = currentUser.Username
	currentUserDetails.ProfilePhoto = currentUser.Password
	currentUserDetails.Posts = currentUser.Posts
	currentUserDetails.Comments = currentUser.Comments
	currentUserDetails.CreatedAt = currentUser.CreatedAt

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"CurrentUser": currentUserDetails,
		"Message":     "User found successfully",
	})

}
