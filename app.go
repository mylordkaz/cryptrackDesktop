package main

import (
	"context"
	"cryptrack/backend/api"
	"cryptrack/backend/config"
	"cryptrack/backend/models"
	"cryptrack/backend/services"
	"cryptrack/backend/storage"
	"time"
)

// App struct
type App struct {
	ctx           context.Context
	api           *api.API
	storage       *storage.TransactionStorage
	cryptoService *services.CryptoService
}

// NewApp creates a new App application struct
func NewApp() *App {
	apiKey := config.LoadAPIKey()
	storage := storage.NewTransactionStorage()
	return &App{
		api:           api.NewAPI(apiKey),
		storage:       storage,
		cryptoService: services.NewCryptoService(storage),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetCryptosList() ([]models.Crypto, error) {
	return a.api.FetchCryptos()
}

func (a *App) AddTransaction(crypto string, amount float64, price float64, total float64, date string, transactionType string) error {
	transaction, err := a.cryptoService.CreateTransaction(crypto, amount, price, total, date, transactionType)
	if err != nil {
		return err
	}
	transactions, err := a.storage.Load()
	if err != nil {
		return err
	}

	transactions = append(transactions, transaction)
	return a.storage.Save(transactions)
}

func (a *App) GetTransactions() ([]models.Transaction, error) {
	return a.storage.Load()
}

func (a *App) UpdateTransaction(id string, crypto string, amount float64, price float64, total float64, date string, transactionType string) error {
	transactions, err := a.storage.Load()
	if err != nil {
		return err
	}

	parsedDate, err := time.Parse("2006-01-02T15:04", date)
	if err != nil {
		return err
	}

	updatedTransactions := make([]models.Transaction, len(transactions))
	for i, tx := range transactions {
		if tx.ID == id {
			updatedTransactions[i] = models.Transaction{
				ID:           id,
				CryptoSymbol: crypto,
				Amount:       amount,
				Price:        price,
				Total:        total,
				Date:         parsedDate,
				Type:         transactionType,
			}
		} else {
			updatedTransactions[i] = tx
		}
	}
	return a.storage.Save(updatedTransactions)
}

func (a *App) DeleteTransaction(id string) error {
	transactions, err := a.storage.Load()
	if err != nil {
		return err
	}

	filteredTransactions := []models.Transaction{}
	for _, tx := range transactions {
		if tx.ID != id {
			filteredTransactions = append(filteredTransactions, tx)
		}
	}
	return a.storage.Save(filteredTransactions)
}
