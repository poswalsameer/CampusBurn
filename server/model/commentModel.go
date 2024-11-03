package model

import "time"

type Comment struct {
	ID             uint `gorm:"primaryKey"`
	CommentContent string
	CreatedAt      time.Time
	UpdatedAt      time.Time
	PostID         uint
	Post           Post
	UserID         uint
	User           User
	LikeCount      uint64
	DislikeCount   uint64
}
