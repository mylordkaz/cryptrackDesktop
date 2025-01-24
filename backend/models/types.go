package models

import (
	"time"

	"gorm.io/gorm"
)

type Crypto struct {
	Symbol       string  `json:"symbol"`
	Name         string  `json:"name"`
	CurrentPrice float64 `json:"currentPrice"`
	LogoUrl      string  `json:"logoUrl"`
}

type Transaction struct {
	ID           string         `json:"id" gorm:"primaryKey"`
	UserID       string         `json:"userId" gorm:"index"`
	CryptoSymbol string         `json:"CryptoSymbol" gorm:"index"`
	Amount       float64        `json:"amount"`
	Price        float64        `json:"price"`
	Total        float64        `json:"total"`
	Date         time.Time      `json:"date" gorm:"index"`
	Note         string         `json:"note"`
	Type         string         `json:"type"`
	CreatedAt    time.Time      `gorm:"autoCreateTime"`
	UpdatedAt    time.Time      `gorm:"autoUpdateTime"`
	DeletedAt    gorm.DeletedAt `gorm:"index"`
}
