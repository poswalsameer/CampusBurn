package model

import "time"

type User struct {
	ID           uint `gorm:"primaryKey"`
	Username     string
	Email        string
	Password     string
	ProfilePhoto string
	AuthToken    string `gorm:"default:''"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	Posts        []Post
	Comments     []Comment
}
