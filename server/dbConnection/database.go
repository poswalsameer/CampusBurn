package dbConnection

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDatabase() {

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error while loading dotenv: ", err)
	}

	// Getting the database url from the env file
	dsn := os.Getenv("DATABASE_URL")

	if dsn == "" {
		log.Fatal("Cannot get the database url from the dotenv file!")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		// Handle the error
		log.Fatal("Failed to connect to database:", err)
		return
	}

	DB = db

	// Connection successful
	fmt.Println("Database connected!")

}
