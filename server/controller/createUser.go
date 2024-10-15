package controller

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func UserCreation(c *fiber.Ctx) error {

	user := model.User{Username: "firstuser", Email: "firstuser@gmail.com", Password: "firstuser", ProfilePhoto: "firstuserphoto"}

	createdUser := dbConnection.DB.Create(&user)

	// IF USER NOT CREATED, THEN SENDING A ERROR RESPONSE
	if createdUser.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "User not created",
		})
	}

	fmt.Println("The ID of the created user is: ", user.ID)
	fmt.Println("Number of rows affected: ", createdUser.RowsAffected)

	// IF USER CREATED, THEN SENDING SUCCESS RESPONSE
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
	})

}
