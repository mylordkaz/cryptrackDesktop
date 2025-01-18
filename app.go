package main

import (
	"context"
	"cryptrack/backend/api"
	"cryptrack/backend/config"
	"cryptrack/backend/db"
	"cryptrack/backend/models"
	"cryptrack/backend/services"
	"log"
	"time"
)

// App struct
type App struct {
	ctx           context.Context
	api           *api.API
	db            *db.Database
	paths         *config.Paths
	cryptoService *services.CryptoService
}

// NewApp creates a new App application struct
func NewApp() *App {
	env := config.GetEnvironment()
	paths, err := config.GetPaths(env)
	if err != nil {
		log.Fatal(err)
	}

	database, err := db.NewDatabase(paths)
	if err != nil {
		log.Fatal(err)
	}

	apiKey := config.LoadAPIKey()

	return &App{
		api:           api.NewAPI(apiKey),
		db:            database,
		paths:         paths,
		cryptoService: services.NewCryptoService(database),
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

func (a *App) AddTransaction(crypto string, amount float64, price float64, total float64, date string, transactionType string, note string) error {
	transaction, err := a.cryptoService.CreateTransaction(crypto, amount, price, total, date, transactionType, note)
	if err != nil {
		return err
	}
	return a.db.SaveTransaction(&transaction)
}

func (a *App) GetTransactions() ([]models.Transaction, error) {
	return a.db.GetTransactions()
}

func (a *App) UpdateTransaction(id string, amount float64, price float64, total float64, date string, note string) error {
	parsedDate, err := time.Parse("2006-01-02T15:04", date)
	if err != nil {
		return err
	}

	tx := models.Transaction{
		ID:     id,
		Amount: amount,
		Price:  price,
		Total:  total,
		Date:   parsedDate,
		Note:   note,
	}
	return a.db.UpdateTransaction(&tx)
}

func (a *App) DeleteTransaction(id string) error {
	return a.db.DeleteTransaction(id)
}
