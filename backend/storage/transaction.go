package storage

import (
	"cryptrack/backend/models"
	"encoding/json"
	"os"
)

type TransactionStorage struct {
	dataPath     string
	transactions []models.Transaction
}

func NewTransactionStorage() *TransactionStorage {
	return &TransactionStorage{
		dataPath: "crypto_transaction.json",
	}
}

func (s *TransactionStorage) Save(transactions []models.Transaction) error {
	data, err := json.MarshalIndent(transactions, "", " ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.dataPath, data, 0644)
}

func (s *TransactionStorage) Load() ([]models.Transaction, error) {
	data, err := os.ReadFile(s.dataPath)
	if err != nil {
		if os.IsNotExist(err) {
			return []models.Transaction{}, nil
		}
		return nil, err
	}
	var transactions []models.Transaction
	err = json.Unmarshal(data, &transactions)
	return transactions, err
}
