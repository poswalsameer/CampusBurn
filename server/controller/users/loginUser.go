package users

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/middleware"
	"campusburn-backend/model"
	"fmt"
	"os"
	"time"

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
	println("JWT_SECRET Length: %d", len(os.Getenv("JWT_SECRET")))

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err,
		})
	}
	println("generated token: ", token)

	// SETTING THE TOKEN IN DATABASE
	existingUser.AuthToken = token
	// After setting cookie

	if err := dbConnection.DB.Save(&existingUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Failed to update AuthToken in database",
		})
	}

	// SETTING THE TOKEN IN COOKIES
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		SameSite: fiber.CookieSameSiteLaxMode, // Use Lax for local development
		Secure:   false,
	})

	fmt.Printf("Cookie set: %v\n", c.Cookies("token"))

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":   "Login successful",
		"email":     existingUser.Email,
		"authToken": existingUser.AuthToken,
	})

}
