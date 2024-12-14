package middleware

import (
	"errors"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
)

func GenerateJWT(userId string) (string, error) {

	// creating the jwt_secret_string
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error while loading the env file in generateToken function.")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return "", errors.New("JWT_SECRET not set in environment")
	}

	//SETTING THE EXPIRATION TIME
	tokenExpiry := time.Now().Add(24 * time.Hour)

	// CREATING CLAIMS
	claims := &jwt.RegisteredClaims{
		Subject:   userId,
		ExpiresAt: jwt.NewNumericDate(tokenExpiry),
		Issuer:    "campusburndb",
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}

	// CREATING THE TOKEN
	createdToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := createdToken.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
