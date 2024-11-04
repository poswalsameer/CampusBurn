package main

import (
	"campusburn-backend/controller"
	"campusburn-backend/controller/comments"
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

	// AUTH RELATED CONTROLLERS
	app.Post("/auth/sign-up", controller.RegisterUser)
	app.Post("/auth/sign-in", controller.LoginUser)
	app.Post("/auth/sign-out", middleware.AuthRequired, controller.LogoutUser)
	app.Post("/auth/deleteUser", middleware.AuthRequired, controller.DeleteUser)

	// CONTROLLERS RELATED TO POST
	app.Post("/createPost", middleware.AuthRequired, controller.CreatePost)
	app.Post("/deletePost", middleware.AuthRequired, controller.DeletePost)
	app.Post("/updatePost", middleware.AuthRequired, controller.UpdatePost)
	app.Post("/likePost", controller.AddLike)
	app.Post("/dislikePost", controller.AddDislike)
	app.Post("/removeLike", controller.RemoveLike)
	app.Post("/removeDislike", controller.RemoveDislike)

	// CONTROLLERS RELATED TO COMMENTS
	app.Post("/addComment", middleware.AuthRequired, comments.AddComment)
	app.Post("/editComment", middleware.AuthRequired, comments.EditComment)
	app.Post("/deleteComment", middleware.AuthRequired, comments.DeleteComment)
	app.Post("/likeComment", middleware.AuthRequired, comments.LikeComment)
	app.Post("/dislikeComment", middleware.AuthRequired, comments.DislikeComment)
	app.Post("/removeCommentLike", middleware.AuthRequired, comments.RemoveLikeComment)
	app.Post("/removeCommentDislike", middleware.AuthRequired, comments.RemoveDislikeComment)

	// setting up the server on port 3000
	app.Listen(":3000")
}
