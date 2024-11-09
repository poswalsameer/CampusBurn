package utils

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"context"
	"os"
	"strconv"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

/*
FLOW TO UPLOAD IN IMAGE TO CLOUDINARY:
--------------------------------------
1. Check the auth status, user should be logged in to add or update profile photo.
2. Get his ID.
3. Create unique image name
4. Upload the image provided by the user with this name - profile-{ID}-photo

*/

func UploadImageToCloudinary(c *fiber.Ctx) error {

	envLoadErr := godotenv.Load(".env")

	if envLoadErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while loading the env variables",
		})
	}

	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	//INITIALISING CLOUDINARY HERE WITH THE ENV VARIABLES
	cld, _ := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)

	var user model.User
	if parsingError := c.BodyParser(&user); parsingError != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Invalid body request",
		})
	}

	userId, ok := c.Locals("userId").(string)

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Message": "Need to login first before image upload",
		})
	}

	var currentUser model.User
	userSearchError := dbConnection.DB.Where("Email = ?", userId).First(&currentUser).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "User not found with this mail ID",
		})
	}

	// GETTING THE FILE FROM THE FORM FIELD "image"
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Message": "Incorrect file sent",
			"File":    file,
		})
	}

	fileHandler, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message":     "Failed to open file",
			"fileHandler": fileHandler,
		})
	}
	defer fileHandler.Close()

	imageName := "ProfilePhoto-" + strconv.FormatUint(uint64(currentUser.ID), 10)

	var ctx = context.Background()
	resp, err := cld.Upload.Upload(ctx, fileHandler, uploader.UploadParams{PublicID: imageName})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while uploading the image to cloudinary",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"Message":           "Image uploaded to cloudinary successfully",
		"Image uploaded by": currentUser.Email,
		"Name of the image": imageName,
		"Response":          resp,
	})

}
