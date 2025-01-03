package main

import (
	"context"
	"cryptrack/backend/api"
	"cryptrack/backend/models"
	"cryptrack/backend/services"
	"cryptrack/backend/storage"
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
	apiKey := "api-key"
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

func (a *App) AddTransaction(crypto string, amount float64, price float64, total float64, date string) error {
	transaction, err := a.cryptoService.CreateTransaction(crypto, amount, price, total, date)
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
