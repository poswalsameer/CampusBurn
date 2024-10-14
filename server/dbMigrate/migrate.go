package main

import (
	"campusburn-backend/dbConnection"
	"campusburn-backend/model"
	"fmt"
)

func init() {
	dbConnection.ConnectToDatabase()
}

func main() {
	if dbConnection.DB == nil {
		fmt.Println("DB connection is nil, cannot perform migration")
		return
	}

	// Perform migration
	err := dbConnection.DB.AutoMigrate(&model.User{})
	if err != nil {
		fmt.Println("Error during migration:", err)
	} else {
		fmt.Println("Migration completed successfully")
	}

}
