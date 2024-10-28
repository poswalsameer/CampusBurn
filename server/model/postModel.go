package model

import "time"

type Post struct {
	ID           uint `gorm:"primaryKey"`
	Content      string
	CreatedAt    time.Time
	UpdatedAt    time.Time
	UserID       uint
	User         User
	LikeCount    uint64 `gorm:"default:0"`
	DislikeCount uint64 `gorm:"default:0"`
	Comments     []Comment
}
