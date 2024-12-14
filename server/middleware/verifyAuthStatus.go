package middleware

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
)

//TODO: I just need to write a method here that checks:
//TODO: The auth_token column in the database
//TODO: if there is nothing present there (empty string) this means the user is not authenticated.
//TODO: And if there is something present then, that needs to be check from the cookie value, if both are same, then user is allowed to move forward

func AuthRequired(c *fiber.Ctx) error {
	// Get token from cookie
	tokenString := c.Cookies("token")

	// Extensive logging
	log.Printf("Received Raw Token: %s", tokenString)

	// Clean the token by removing prefixes and spaces
	cleanToken := strings.TrimPrefix(tokenString, "%s ")
	cleanToken = strings.TrimPrefix(cleanToken, "Bearer%20")
	cleanToken = strings.TrimPrefix(cleanToken, "Bearer ")
	cleanToken = strings.TrimSpace(cleanToken)

	// Log the cleaned token
	log.Printf("Cleaned Token: %s", cleanToken)

	// Load environment variables (in case they weren't loaded)
	if err := godotenv.Load(".env"); err != nil {
		log.Printf("Error loading .env file: %v", err)
	}

	// Get JWT secret with extensive logging
	jwtSecret := os.Getenv("JWT_SECRET")
	log.Printf("JWT_SECRET from env: %s", jwtSecret)
	log.Printf("JWT_SECRET Length: %d", len(jwtSecret))

	// Validate token presence
	if cleanToken == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "No valid token provided",
		})
	}

	// Parsing with comprehensive error handling
	token, err := jwt.Parse(cleanToken, func(token *jwt.Token) (interface{}, error) {
		// Verify signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// Return the secret key for verification
		return []byte(jwtSecret), nil
	})

	// Comprehensive error handling
	if err != nil {
		log.Printf("Token Parsing Error: %v", err)

		// More specific error checking
		if ve, ok := err.(*jwt.ValidationError); ok {
			if ve.Errors&jwt.ValidationErrorMalformed != 0 {
				log.Println("Token is malformed")
			}
			if ve.Errors&jwt.ValidationErrorSignatureInvalid != 0 {
				log.Println("Signature validation failed")

				// Additional diagnostic logging
				log.Printf("Secret Key Used: %s", jwtSecret)
				log.Printf("Token Claims: %+v", token.Claims)
			}
		}

		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error":   "Invalid token",
			"details": err.Error(),
		})
	}

	// Verify token is valid
	if !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Token is invalid",
		})
	}

	// Extract claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unable to extract claims",
		})
	}

	// Set user ID in locals
	userId, ok := claims["id"].(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid user ID in token",
		})
	}

	c.Locals("userId", userId)

	return c.Next()
}
