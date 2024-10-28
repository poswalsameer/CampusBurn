package main

import (
	"campusburn-backend/controller"
	"campusburn-backend/dbConnection"
	"campusburn-backend/middleware"
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

	// USER CREATION ROUTE
	app.Post("/auth/sign-up", controller.RegisterUser)

	// LOGIN ROUTE
	app.Post("/auth/sign-in", controller.LoginUser)

	// LOGOUT USER ROUTE
	app.Post("/auth/sign-out", middleware.AuthRequired, controller.LogoutUser)

	// CREATE POST ROUTE
	app.Post("/createPost", middleware.AuthRequired, controller.CreatePost)

	// DELETE POST ROUTE
	app.Post("/deletePost", middleware.AuthRequired, controller.DeletePost)

	// setting up the server on port 3000
	app.Listen(":3000")
}
