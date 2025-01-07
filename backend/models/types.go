package models

import "time"

type Crypto struct {
	Symbol       string  `json:"symbol"`
	Name         string  `json:"name"`
	CurrentPrice float64 `json:"currentPrice"`
}

type Transaction struct {
	ID           string    `json:"id"`
	CryptoSymbol string    `json:"CryptoSymbol"`
	Amount       float64   `json:"amount"`
	Price        float64   `json:"price"`
	Total        float64   `json:"total"`
	Date         time.Time `json:"date"`
	Type         string    `json:"type"`
}
