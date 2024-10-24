package controller

import "github.com/gofiber/fiber/v2"

func LoginUser(c *fiber.Ctx) error {

	return c.JSON(fiber.Map{
		"message": "ok",
	})

}
