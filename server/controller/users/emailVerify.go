package users

import (
	"github.com/gofiber/fiber/v2"
	gomail "gopkg.in/mail.v2"
)

func EmailVerification( c *fiber.Ctx ) error {

	message := gomail.NewMessage()

	message.SetHeader("From", "@noreply@email.com")
    message.SetHeader("To", "recipient1@email.com")
    message.SetHeader("Subject", "Campusburn: Verify your email address")

	message.SetBody("text/plain", "This is the Test Body")

	dialer := gomail.NewDialer("live.smtp.mailtrap.io", 587, "api", "1a2b3c4d5e6f7g")

    // Send the email
    if err := dialer.DialAndSend(message); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while sending the message through mail",
		})        
    } 

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"Message": "Email sent successfully",
	})

}