package users

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/middleware"
	"campusburn-backend/model"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*
THE FLOW OF REGISTERING EVERY USER ON THE APPLICATION:
------------------------------------------------------
1. Get all the data coming from the client side through body parser.
2. Do sanity check on the data, if it is accurate or not.
3. Check if this user already exists in the db or not.
4. If exists, return with a 409 http code.
5. If not, then first hash the password using a middleware just before creating the user and saving it into the db.
6. Handle all the errors gracefully to send specific JSON messages back to the frontend.
*/

func RegisterUser(c *fiber.Ctx) error {

	var user model.User

	// CHECKING IF THE INCOMING DATA FROM THE REQUEST IS OKAY OR NOT
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Invalid request body",
		})
	}

	// VALIDATING THE INCOMING DATA
	if user.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Email is required for sign-up",
		})
	}
	if user.Username == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Username is required for sign-up",
		})
	}
	if user.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Password is required for sign-up",
		})
	}

	// FINDING IF USER ALREADY EXISTS OR NOT
	result := dbConnection.DB.Where("Email = ?", user.Email).Limit(1).Find(&model.User{})

	// IF USER ALREADY EXISTS, THEN SENDING ERROR JSON RESPONSE
	if result.Error == nil && result.RowsAffected > 0 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"Error": "User already exists",
		})
	}

	//Hashing the password before saving it into the database
	hashedPassword, err := middleware.HashPassword(user.Password)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Cannot save the password in the database",
		})
	}

	user.Password = hashedPassword
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	// CREATE JWT TOKEN FOR THE USER
	token, err := middleware.GenerateJWT(user.Email)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err,
		})
	}

	// SETTING THE TOKEN IN DATABASE
	user.AuthToken = token

	// SETTING THE TOKEN IN COOKIES
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		SameSite: fiber.CookieSameSiteLaxMode, // Use Lax for local development
		Secure:   false,
	})

	// SAVING THE USER INTO THE DATABASE
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
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"id":        user.ID,
		"username":  user.Username,
		"email":     user.Email,
		"authToken": user.AuthToken,
	})

}
