package controller

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type userFormat struct {
	username string
	email    string
	password string
}

func RegisterUser(c *fiber.Ctx) error {

	var user model.User

	// CHECKING IF THE INCOMING DATA FROM THE REQUEST IS OKAY OR NOT
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// FINDING IF USER ALREADY EXISTS OR NOT
	var existingUser model.User
	dbConnection.DB.Where("Email = ?", user.Email).First(&existingUser)

	// IF USER ALREADY EXISTS, THEN SENDING ERROR JSON RESPONSE
	if dbConnection.DB.RowsAffected > 0 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"Error": "User already exists",
		})
	}

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
