package controller

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/middleware"
	"campusburn-backend/model"

	"github.com/gofiber/fiber/v2"
)

/*
FLOW TO LOGIN THE USER INTO THE APPLICATION:
--------------------------------------------

1. Get the incoming data from the client.
2. Do Sanity check on the data, if it is accurate or not
3. Find the email of the user if it exists in the database or not.
4. If the email not exists, return json response with http code.
5. If the email exists, check the password from the hashed password stored in the DB.
6. If the password is wrong, return response with http code.
7. If the password is correct, return 200 code with json response and re-route to the dashboard route.
*/

func LoginUser(c *fiber.Ctx) error {

	var user model.User

	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Invalid request body",
		})
	}

	// VALIDATING THE INCOMING DATA FROM THE CLIENT SIDE
	if user.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Email is required for login",
		})
	}

	if user.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Password is required for login",
		})
	}

	// FINDING THE EMAIL OF THE USER IN THE DB
	var existingUser model.User
	userInDB := dbConnection.DB.Where("Email = ?", user.Email).First(&existingUser)

	if userInDB.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": "User does not exists",
		})
	}

	// CHECKING THE ENTERED PASSWORD WITH THE SAVED PASSWORD
	isPasswordCorrect := middleware.CheckPassword(user.Password, existingUser.Password)

	// PASSWORD DOES NOT MATCHES
	if !isPasswordCorrect {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Wrong password entered",
		})
	}

	// CREATE JWT TOKEN FOR THE USER
	token, err := middleware.GenerateJWT(user.Email)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err,
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"Message": "Login successful",
		"Token":   token,
	})

}
