package middleware

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func AuthRequired(c *fiber.Ctx) error {

	// GET THE JWT TOKEN FROM THE COOKIE
	tokenString := c.Cookies("token")

	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Error": "Unauthorized, please log in",
		})
	}

	// PARSING AND VERIFYING OF THE TOKEN
	token, err := jwt.ParseWithClaims(tokenString, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {

		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Unexpected signing method")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	// IF TOKEN IS INVALID OR EXPIRED
	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Error": "Invalid or expired token, please log in again",
		})
	}

	// IF TOKEN IS VALID, THEN EXTRACT THE CLAIMS, (this means get the userId of the user who has this JWT)
	claims, ok := token.Claims.(*jwt.RegisteredClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Error": "Invalid token claims",
		})
	}

	// SET THE userId IN LOCALS FOR FUTURE USE IN SOME OTHER FUNCTION
	c.Locals("userId", claims.Subject)

	return c.Next()
}
