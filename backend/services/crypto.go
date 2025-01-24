package services

import (
	"cryptrack/backend/db"
	"cryptrack/backend/models"
	"time"

	"github.com/google/uuid"
)

type CryptoService struct {
	db *db.Database
}

func NewCryptoService(db *db.Database) *CryptoService {
	return &CryptoService{
		db: db,
	}
}

func (s *CryptoService) CreateTransaction(userID string, crypto string, amount float64, price float64, total float64, date string, transactionType string, note string) (models.Transaction, error) {

	if transactionType == "sell" {
		amount = -amount
		total = amount * price
	} else {
		// calculate price if total is provided
		if total > 0 && price == 0 {
			price = total / amount
		}
		// calculate total if price is provided
		if price > 0 && total == 0 {
			total = price * amount
		}

	}

	parsedDate, err := time.Parse("2006-01-02T15:04", date)
	if err != nil {
		return models.Transaction{}, err
	}

	return models.Transaction{
		ID:           uuid.New().String(),
		UserID:       userID,
		CryptoSymbol: crypto,
		Amount:       amount,
		Price:        price,
		Total:        total,
		Date:         parsedDate,
		Type:         transactionType,
		Note:         note,
	}, nil
}
