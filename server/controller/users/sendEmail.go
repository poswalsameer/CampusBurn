package users

import (
	"campusburn-backend/utils"
	"crypto/rand"
	"fmt"
	"log"
	"math/big"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/resend/resend-go/v2"
)

type RequestBody struct {
	Email string `json:"email"`
}

func generateOTP() (string, error) {
	// Generate a random number between 100000 and 999999
	n, err := rand.Int(rand.Reader, big.NewInt(899999))
	if err != nil {
		return "", err
	}
	otp := fmt.Sprintf("%06d", n.Int64()+100000)
	return otp, nil
}

func SendEmail(c *fiber.Ctx) error {

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error while loading the env")
	}

	resendAPI := os.Getenv("RESEND_API_KEY")

	if resendAPI == "" {
		log.Fatal("Cannot find the api key from the API")
	}

	client := resend.NewClient(resendAPI)

	var body RequestBody
	if parsingError := c.BodyParser(&body); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Invalid request body",
		})
	}

	if body.Email == "" {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": "Email required for sending the OTP",
		})
	}

	otp, err := generateOTP()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while generating the OTP",
		})
	}

	//SAVING THE OTP IN A MAPPING WITH THE USER EMAIL
	utils.AddOTP(body.Email, otp, time.Now().Add(5*time.Minute))

	params := &resend.SendEmailRequest{
		From:    "onboarding@resend.dev",
		To:      []string{body.Email},
		Subject: "Please verify your email",
		Html:    fmt.Sprintf("<p>Your OTP is <strong>%s</strong></p>", otp),
	}

	sent, err := client.Emails.Send(params)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": "Error while sending the email",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Email sent successfully",
		"Data":    sent,
	})

}
