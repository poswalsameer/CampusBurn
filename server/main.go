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

	// USER/AUTH RELATED CONTROLLERS
	app.Post("/auth/sign-up", users.RegisterUser)
	app.Post("/auth/sign-in", users.LoginUser)
	app.Post("/auth/sign-out", users.LogoutUser)
	app.Delete("/auth/deleteUser/:userId", middleware.AuthRequired, users.DeleteUser)
	app.Post("/updateUser", middleware.AuthRequired, users.UpdateUser)
	app.Post("/sendEmail", users.SendEmail)
	app.Post("/verifyEmail", users.VerifyEmail)
	app.Post("/getCurrentUser", users.GetCurrentUser)
	app.Post("/getCurrentUserById", users.GetCurrentUserById)

	// THIRD-PARTY SERVICE RELATED CONTROLLERS
	app.Post("/uploadImage", middleware.AuthRequired, utils.UploadImageToCloudinary)
	app.Get("/getImage", middleware.AuthRequired, utils.FetchImageFromCloudinary)

	// CONTROLLERS RELATED TO POST
	app.Post("/createPost", middleware.AuthRequired, posts.CreatePost)
	app.Post("/deletePost", middleware.AuthRequired, posts.DeletePost)
	app.Put("/updatePost", middleware.AuthRequired, posts.UpdatePost)
	app.Post("/likePost", posts.AddLike)
	app.Post("/dislikePost", posts.AddDislike)
	app.Post("/removeLike", posts.RemoveLike)
	app.Post("/removePostDislike", posts.RemoveDislike)
	app.Get("/getAllPosts", posts.GetAllPosts)
	app.Post("/getCurrentUserPosts", posts.GetCurrentUserPosts)
	app.Get("/getTopPosts", posts.GetTopPosts)

	// CONTROLLERS RELATED TO COMMENTS
	app.Post("/addComment", middleware.AuthRequired, comments.AddComment)
	app.Put("/editComment", middleware.AuthRequired, comments.EditComment)
	app.Post("/deleteComment", middleware.AuthRequired, comments.DeleteComment)
	app.Post("/likeComment", comments.LikeComment)
	app.Post("/dislikeComment", comments.DislikeComment)
	app.Post("/removeCommentLike", comments.RemoveLikeComment)
	app.Post("/removeCommentDislike", comments.RemoveDislikeComment)
	app.Post("/allComments", comments.GetAllCommentForAPost)

	// setting up the server on port 3000
	app.Listen(":4200")
}
