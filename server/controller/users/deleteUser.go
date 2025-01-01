package users

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"strconv"

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

	// _, ok := c.Locals("userId").(string)

	// if !ok {
	// 	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
	// 		"Error": "User not authorized to perform this action",
	// 	})
	// }
	token := c.Cookies("token")

	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Message": "Unauthorized user, log in",
		})
	}

	userId := c.Params("userId")
	if userId == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "User ID is required in the URL",
		})
	}

	UserId, err := strconv.ParseUint(userId, 10, 32)
	if err != nil {
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"Message": "Error during converting userId to uint from string",
		})
	}

	var userInDB model.User
	userSearchError := dbConnection.DB.Where("ID = ?", UserId).First(&userInDB).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": "User not found in the DB during delete operation",
		})
	}

	var checkID = userInDB.ID == uint(UserId)

	if !checkID {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"Error": "Can be deleted by the user themselves",
		})
	}

	//FIRST DELETE ALL THE COMMENTS FOR THIS USER
	commentDeleteError := dbConnection.DB.Where("user_id = ?", userInDB.ID).Delete(&model.Comment{}).Error
	if commentDeleteError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Comments for this user cannot be deleted for now",
		})
	}

	//DELETE ALL THE POSTS OF THIS USER AFTER DELETING THE COMMENTS
	postDeleteError := dbConnection.DB.Where("user_id = ?", userInDB.ID).Delete(&model.Post{}).Error
	if postDeleteError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Posts for this user cannot be deleted for now",
		})
	}

	//FINALLY DELETE THE USER AFTER DELETING THE POSTS AND THE COMMENTS
	deleteUserError := dbConnection.DB.Where("ID = ?", userInDB.ID).Delete(&userInDB).Error
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
