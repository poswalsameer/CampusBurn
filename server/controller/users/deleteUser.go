package users

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO DELETE THE USER:
-----------------------
1. First check the auth status, user can only delete if it is logged in.
2. Parse the incoming data
3. Check the ID of the user incoming with the ID of the user is trying to delete.
4. If same, then delete the row from DB, and return response.
5. If not same, then return err response.
*/

func DeleteUser(c *fiber.Ctx) error {

	_, ok := c.Locals("userId").(string)

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Error": "User not authorized to perform this action",
		})
	}

	var currentUser model.User
	if parsingError := c.BodyParser(&currentUser); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Invalid request body",
		})
	}

	var userInDB model.User
	userSearchError := dbConnection.DB.Where("ID = ?", currentUser.ID).First(&userInDB).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": "User not found in the DB during delete operation",
		})
	}

	var checkID = userInDB.ID == currentUser.ID

	if !checkID {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"Error": "Can be deleted by the user themselves",
		})
	}

	deleteUserError := dbConnection.DB.Where("ID = ?", userInDB.ID).Delete(userInDB).Error
	if deleteUserError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Cannot delete the user due to some error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":                     "User deleted successfully",
		"User deleted with this mail": userInDB.Email,
	})

}
