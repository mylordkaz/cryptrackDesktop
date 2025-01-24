package main

import (
	"context"
	"cryptrack/backend/api"
	"cryptrack/backend/auth"
	"cryptrack/backend/config"
	"cryptrack/backend/db"
	"cryptrack/backend/models"
	"cryptrack/backend/services"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/keybase/go-keychain"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx           context.Context
	api           *api.API
	db            *db.Database
	paths         *config.Paths
	cryptoService *services.CryptoService
	authService   *auth.AuthService
	currentUser   *models.User
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
		authService:   auth.NewAuthService(database),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Theme
func (a *App) SaveTheme(theme string) error {
	data := []byte(theme)
	return os.WriteFile(filepath.Join(a.paths.DataDir, "theme.txt"), data, 0644)
}

func (a *App) LoadTheme() (string, error) {
	data, err := os.ReadFile(filepath.Join(a.paths.DataDir, "theme.txt"))
	if err != nil {
		if os.IsNotExist(err) {
			return "", nil
		}
		return "", err
	}
	return string(data), nil
}

// Crypto API
func (a *App) GetCryptosList() ([]models.Crypto, error) {
	return a.api.FetchCryptos()
}

// Transactions
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

// Authentication
func (a *App) Register(username, password string) error {
	user, err := a.authService.Register(username, password)
	if err != nil {
		return err
	}

	a.currentUser = user
	return nil
}

	a.currentUser = user
	return nil
}

func (a *App) Login(username, password string) error {
	user, err := a.authService.Login(username, password)
	if err != nil {
		return err
	}
	a.currentUser = user
	return nil
}




