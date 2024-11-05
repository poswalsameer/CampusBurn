package users

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO LOGOUT THE USER FROM THE APPLICATION:
--------------------------------------------
1. Check the auth status, if not authenticated, then return error response.
2. If authenticated, clear the cookies of the user.
3. Take the user back to the home route and return ok response.

*/

func LogoutUser(c *fiber.Ctx) error {

	// CHECKING THE AUTH STATUS FROM THE MIDDLEWARE
	userId, ok := c.Locals("userId").(string)

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Error": "Unauthorized user",
		})
	}

	token := c.Cookies("token")

	// SETTING THE EXPIRY DATE OF THE SAME TOKEN TO 0 seconds TO EXPIRE IT RIGHT NOW
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		Path:     "/",
		HTTPOnly: true,
		Secure:   true,
	})

	var existingUser model.User
	userReturnedError := dbConnection.DB.Where("Email = ?", userId).First(&existingUser).Error
	if userReturnedError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": userReturnedError.Error(),
		})
	}

	// CLEARING THE AUTH TOKEN FROM THE DB ALSO
	existingUser.AuthToken = ""

	if err := dbConnection.DB.Save(&existingUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while saving the user auth token in logout controller",
		})
	}

	// SENDING OK RESPONSE AFTER LOGGING OUT
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "User logged out",
		"Token":   token,
	})

}
