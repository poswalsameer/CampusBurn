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
	"github.com/gofiber/fiber/v2/middleware/cors"
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

	// CREATING A APP JUST LIKE WE DO IN EXPRESS
	app := fiber.New()

	//MIDDLEWARE FOR CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowMethods:     "GET,POST,PUT,DELETE",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	// AUTH RELATED CONTROLLERS
	app.Post("/auth/sign-up", users.RegisterUser)
	app.Post("/auth/sign-in", users.LoginUser)
	app.Post("/auth/sign-out", users.LogoutUser)
	app.Delete("/auth/deleteUser", middleware.AuthRequired, users.DeleteUser)
	app.Post("/sendEmail", users.SendEmail)
	app.Post("/verifyEmail", users.VerifyEmail)

	// THIRD-PARTY SERVICE RELATED CONTROLLERS
	app.Post("/uploadImage", middleware.AuthRequired, utils.UploadImageToCloudinary)
	app.Get("/getImage", middleware.AuthRequired, utils.FetchImageFromCloudinary)

	// CONTROLLERS RELATED TO POST
	app.Post("/createPost", middleware.AuthRequired, posts.CreatePost)
	app.Delete("/deletePost", middleware.AuthRequired, posts.DeletePost)
	app.Put("/updatePost", middleware.AuthRequired, posts.UpdatePost)
	app.Post("/likePost", posts.AddLike)
	app.Post("/dislikePost", posts.AddDislike)
	app.Delete("/deletePostLike", posts.RemoveLike)
	app.Delete("/deletePostDislike", posts.RemoveDislike)
	app.Get("/getAllPosts", posts.GetAllPosts)

	// CONTROLLERS RELATED TO COMMENTS
	app.Post("/addComment", middleware.AuthRequired, comments.AddComment)
	app.Put("/editComment", middleware.AuthRequired, comments.EditComment)
	app.Delete("/deleteComment", middleware.AuthRequired, comments.DeleteComment)
	app.Post("/likeComment", middleware.AuthRequired, comments.LikeComment)
	app.Post("/dislikeComment", middleware.AuthRequired, comments.DislikeComment)
	app.Delete("/deleteCommentLike", middleware.AuthRequired, comments.RemoveLikeComment)
	app.Delete("/deleteCommentDislike", middleware.AuthRequired, comments.RemoveDislikeComment)

	// setting up the server on port 3000
	app.Listen(":4200")
}
