package db

import (
	"cryptrack/backend/models"
	"encoding/json"
	"os"
	"path/filepath"

	"gorm.io/gorm"
)

func MigrateFromJSON(db *Database) error {
	oldDataPath := filepath.Join("data", "crypto_transactions.json")

	if _, err := os.Stat(oldDataPath); os.IsNotExist(err) {
		return nil
	}

	data, err := os.ReadFile(oldDataPath)
	if err != nil {
		return err
	}

	var transactions []models.Transaction
	if err := json.Unmarshal(data, &transactions); err != nil {
		return err
	}

	return db.db.Transaction(func(tx *gorm.DB) error {
		for _, transaction := range transactions {
			var exist models.Transaction
			if err := tx.Where("id = ?", transaction.ID).First(&exist).Error; err == gorm.ErrRecordNotFound {
				if err := tx.Create(&transaction).Error; err != nil {
					return err
				}
			}
		}
		return nil
	})
}
