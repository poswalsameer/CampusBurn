package model

import "time"

type User struct {
	ID           uint `gorm:"primaryKey"`
	Username     string
	Email        string
	Password     string
	ProfilePhoto string
	CreatedAt    time.Time
	UpdatedAt    time.Time
	Posts        []Post
}
