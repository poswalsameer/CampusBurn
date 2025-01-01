package users

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO UPDATE THE USER:
-----------------------
1. First check the auth status of the user, if not authenticated, then return err.
2. Then, validate the new data incoming from the req.
3. If all okay, then update the details of the user, save it in DB.
4. Return the response.
*/

type UpdateUserRequest struct {
	UserId   uint   `json:"userId"`
	Username string `json:"username"`
}

func UpdateUser(c *fiber.Ctx) error {

	token := c.Cookies("token")

	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Message": "Not authorized, please login or signup",
		})
	}

	var request UpdateUserRequest
	if parsingError := c.BodyParser(&request); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Request is not of the correct type",
		})
	}

	if request.Username == "" {
		return c.Status(fiber.StatusNotAcceptable).JSON(fiber.Map{
			"Message": "Username cannot be left empty",
		})
	}

	var user model.User
	if userSearchError := dbConnection.DB.Where("ID = ?", request.UserId).First(&user); userSearchError.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "User not found in the database",
		})
	}

	user.Username = request.Username

	if userUpdateError := dbConnection.DB.Save(&user); userUpdateError.Error != nil {
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"Messaege": "Error while saving the user in the database",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":      "User updated successfully",
		"Updated User": user,
	})

}
