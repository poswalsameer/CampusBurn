package users

import (
	"campusburn-backend/utils"
	"time"

	"github.com/gofiber/fiber/v2"
)

type VerifyOTPRequest struct {
	Email string `json:"email"`
	OTP   string `json:"otp"`
}

/*
FLOW TO VERIFY THE OTP:
----------------------
1. Check the request body, if invalid, return
2. Check if the OTP and email from body are not empty
3. Check if the time for the OTP is still remaining or not
4. If time completed, then delete the OTP, and send response to resend OTP
3. Check the OTP if it is correct or not
4. If everything is fine, then return a boolean response

*/

func VerifyEmail(c *fiber.Ctx) error {

	var body VerifyOTPRequest
	if parsingError := c.BodyParser(&body); parsingError != nil {
		c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": "Invalid request body",
		})
	}

	if body.Email == "" || body.OTP == "" {
		return c.Status(fiber.StatusNotAcceptable).JSON(fiber.Map{
			"Message": "Both Email and OTP are required",
			"Status":  true,
		})
	}

	otpDetails, otpExists := utils.GetOTP(body.Email)
	if !otpExists {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "OTP not found or expired, try resending the OTP again",
			"Status":  true,
		})
	}

	//CODE BLOCK TO CHECK IF OTP EXPIRED OR NOT
	if time.Now().After(otpDetails.ExpiryTime) {
		utils.DeleteOTP(body.Email)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Error":  "OTP has expired, resend OTP",
			"Status": true,
		})
	}

	if otpDetails.OTP != body.OTP {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"Message": "OTP entered is not correct",
			"Status":  true,
		})
	}

	//DELETING THE OTP BEFORE RETURING THE RESPONSE, SINCE IT'S CORRECT
	utils.DeleteOTP(body.Email)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Email verified successfully",
		"Success": true,
	})

}
