package db

import (
	"cryptrack/backend/config"
	"cryptrack/backend/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Database struct {
	db    *gorm.DB
	paths *config.Paths
}

func NewDatabase(paths *config.Paths) (*Database, error) {
	db, err := gorm.Open(sqlite.Open(paths.DatabasePath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	// Auto migrate schema
	err = db.AutoMigrate(&models.Transaction{}, &models.User{})
	if err != nil {
		return nil, err
	}

	database := &Database{
		db:    db,
		paths: paths,
	}

	// Run migration from JSON
	if err := MigrateFromJSON(database); err != nil {
		return nil, err
	}

	return database, nil
}

// Transactions

func (d *Database) SaveTransaction(tx *models.Transaction) error {
	return d.db.Save(tx).Error
}

func (d *Database) GetTransactions() ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := d.db.Order("date asc").Find(&transactions).Error
	return transactions, err
}

func (d *Database) DeleteTransaction(id string) error {
	return d.db.Unscoped().Delete(&models.Transaction{}, "id = ?", id).Error
}

func (d *Database) GetTransactionsByCrypto(symbol string) ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := d.db.Where("crypto_symbol = ?", symbol).Order("date desc").Find(&transactions).Error
	return transactions, err
}

func (d *Database) UpdateTransaction(tx *models.Transaction) error {
	return d.db.Model(&models.Transaction{}).Where("id = ?", tx.ID).Updates(map[string]interface{}{
		"amount": tx.Amount,
		"price":  tx.Price,
		"total":  tx.Total,
		"date":   tx.Date,
		"note":   tx.Note,
	}).Error
}

// Users

func (d *Database) CreateUser(user *models.User) error {
	return d.db.Create(user).Error
}

func (d *Database) GetUserByUsername(username string) (*models.User, error) {
	var user models.User
	err := d.db.Where("username = ?", username).First(&user).Error
	return &user, err
}

func (d *Database) UpdateUserTouchID(userID string, enabled bool) error {
	return d.db.Model(&models.User{}).Where("id = ?", userID).Update("touch_id_enabled", enabled).Error
}
