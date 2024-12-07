package utils

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"context"
	"os"
	"strconv"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/admin"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

/*
FLOW TO FETCH IMAGE_URL FROM THE CLOUDINARY:
-------------------------------------------
1. First check the auth status.
2. Load the enviroment variables.
3. Get the secure_url from the image.
*/

func FetchImageFromCloudinary(c *fiber.Ctx) error {

	envLoadErr := godotenv.Load(".env")

	if envLoadErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while loading the environment variables",
		})
	}

	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	//INITIALISING CLOUDINARY HERE WITH THE ENV VARIABLES
	cld, _ := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)

	userId, ok := c.Locals("userId").(string)

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Message": "Cannot perform action if the user is not authenticated",
		})
	}

	var currentUser model.User
	userSearchError := dbConnection.DB.Where("Email = ?", userId).First(&currentUser).Error
	if userSearchError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Message": "Cannot find the user with this email ID",
		})
	}

	// NAME OF THE IMAGE STORED IN CLOUDINARY
	imageName := "ProfilePhoto-" + strconv.FormatUint(uint64(currentUser.ID), 10)

	ctx := context.Background()
	resp, err := cld.Admin.Asset(ctx, admin.AssetParams{PublicID: imageName})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Message": "Error while fetching the image from cloudinary",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message":          "Image fetched succesfully",
		"User":             currentUser.Email,
		"Image secure_url": resp.SecureURL,
	})

}
