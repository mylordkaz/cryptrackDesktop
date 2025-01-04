package api

import (
	"cryptrack/backend/models"
	"encoding/json"
	"net/http"
)

type API struct {
	apiKey  string
	baseURL string
}

func NewAPI(apiKey string) *API {
	return &API{
		apiKey:  apiKey,
		baseURL: "http://pro-api.coinmarketcap.com/v1",
	}
}

func (api *API) FetchCryptos() ([]models.Crypto, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", api.baseURL+"/cryptocurrency/listings/latest", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("X-CMC_PRO_API_KEY", api.apiKey)
	req.Header.Set("accept", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var response struct {
		Data []struct {
			Symbol string `json:"symbol"`
			Name   string `json:"name"`
		} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, err
	}
	cryptos := make([]models.Crypto, 0, 50)
	for i, coin := range response.Data {
		if i >= 50 {
			break
		}
		cryptos = append(cryptos, models.Crypto{
			Symbol: coin.Symbol,
			Name:   coin.Name,
		})
	}
	return cryptos, nil
}
