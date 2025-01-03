package main

import (
	"context"
	"cryptrack/backend/api"
	"cryptrack/backend/models"
)

// App struct
type App struct {
	ctx context.Context
	api *api.API
}

// NewApp creates a new App application struct
func NewApp() *App {
	apiKey := "api-key"
	return &App{
		api: api.NewAPI(apiKey),
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
