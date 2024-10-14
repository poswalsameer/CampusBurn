package main

import (
	"campusburn-backend/dbConnection"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func init() {
	dbConnection.ConnectToDatabase()
}

func main() {

	// loading the env files first
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error while loading env file: ", err)
	}

	// creating a app just like we do in express
	app := fiber.New()

	// Creating first route
	// app.Get("/", func(c *fiber.Ctx) error {
	// 	return c.SendString("First time learning Go Fiber")
	// })

	// setting up the server on port 3000
	app.Listen(":3000")
}
