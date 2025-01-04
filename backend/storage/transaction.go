package storage

import (
	"cryptrack/backend/models"
	"encoding/json"
	"os"
	"path/filepath"
)

type TransactionStorage struct {
	dataPath     string
	transactions []models.Transaction
}

func NewTransactionStorage() *TransactionStorage {
	if err := os.MkdirAll("data", 0755); err != nil {
		return &TransactionStorage{dataPath: "crypto_transactions.json"}
	}
	return &TransactionStorage{
		dataPath: filepath.Join("data", "crypto_transactions.json"),
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
