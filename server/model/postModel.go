package model

import "time"

type Post struct {
	ID           uint `gorm:"primaryKey"`
	Content      string
	CreatedAt    time.Time
	UpdatedAt    time.Time
	UserID       uint
	User         User
	LikeCount    uint64
	DislikeCount uint64
	Comments     []Comment
}
