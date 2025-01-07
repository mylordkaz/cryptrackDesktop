package services

import (
	"cryptrack/backend/models"
	"cryptrack/backend/storage"
	"time"

	"github.com/google/uuid"
)

type CryptoService struct {
	storage *storage.TransactionStorage
}

func NewCryptoService(storage *storage.TransactionStorage) *CryptoService {
	return &CryptoService{
		storage: storage,
	}
}

func (s *CryptoService) CreateTransaction(crypto string, amount float64, price float64, total float64, date string, transactionType string) (models.Transaction, error) {
	// calculate price if total is provided
	if total > 0 && price == 0 {
		price = total / amount
	}
	// calculate total if price is provided
	if price > 0 && total == 0 {
		total = price * amount
	}

	if transactionType == "sell" {
		amount = -amount
	}

	parsedDate, err := time.Parse("2006-01-02T15:04", date)
	if err != nil {
		parsedDate = time.Now()
	}

	return models.Transaction{
		ID:           uuid.New().String(),
		CryptoSymbol: crypto,
		Amount:       amount,
		Price:        price,
		Total:        total,
		Date:         parsedDate,
		Type:         transactionType,
	}, nil
}
