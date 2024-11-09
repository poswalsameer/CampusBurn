package main

import (
	"campusburn-backend/controller/comments"
	"campusburn-backend/controller/posts"
	"campusburn-backend/controller/users"
	"campusburn-backend/dbConnection"
	"campusburn-backend/middleware"
	"campusburn-backend/utils"
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
	app.Post("/auth/sign-up", users.RegisterUser)
	app.Post("/auth/sign-in", users.LoginUser)
	app.Post("/auth/sign-out", middleware.AuthRequired, users.LogoutUser)
	app.Post("/auth/deleteUser", middleware.AuthRequired, users.DeleteUser)

	// THIRD-PARTY SERVICE RELATED CONTROLLERS
	app.Post("/uploadImage", middleware.AuthRequired, utils.UploadImageToCloudinary)

	// CONTROLLERS RELATED TO POST
	app.Post("/createPost", middleware.AuthRequired, posts.CreatePost)
	app.Post("/deletePost", middleware.AuthRequired, posts.DeletePost)
	app.Post("/updatePost", middleware.AuthRequired, posts.UpdatePost)
	app.Post("/likePost", posts.AddLike)
	app.Post("/dislikePost", posts.AddDislike)
	app.Post("/removeLike", posts.RemoveLike)
	app.Post("/removeDislike", posts.RemoveDislike)

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
