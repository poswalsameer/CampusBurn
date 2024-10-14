package model

import "time"

type User struct {
	ID           uint //primary key
	Username     string
	Email        string
	Password     string
	ProfilePhoto string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
