package api

import (
	"cryptrack/backend/models"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

type API struct {
	apiKey  string
	baseURL string
}

func NewAPI(apiKey string) *API {
	return &API{
		apiKey:  apiKey,
		baseURL: "http://pro-api.coinmarketcap.com",
	}
}

func (api *API) FetchCryptos() ([]models.Crypto, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", api.baseURL+"/v1/cryptocurrency/listings/latest", nil)
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
			ID     int    `json:"id"`
			Symbol string `json:"symbol"`
			Name   string `json:"name"`
			Quote  struct {
				USD struct {
					Price float64 `json:"price"`
				} `json:"USD"`
			} `json:"quote"`
		} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, err
	}

	ids := make([]string, 0, 50)
	for i, coin := range response.Data {
		if i >= 50 {
			break
		}
		ids = append(ids, strconv.Itoa(coin.ID))
	}

	// Get the logos with specific IDs
	logoReq, err := http.NewRequest("GET", fmt.Sprintf("%s/v2/cryptocurrency/info?id=%s", api.baseURL, strings.Join(ids, ",")), nil)
	if err != nil {
		return nil, err
	}
	logoReq.Header.Set("X-CMC_PRO_API_KEY", api.apiKey)
	logoReq.Header.Set("accept", "application/json")

	logoResp, err := client.Do(logoReq)
	if err != nil {
		return nil, err
	}
	defer logoResp.Body.Close()

	var logoResponse struct {
		Data map[string]struct {
			Logo string `json:"logo"`
		} `json:"data"`
	}
	if err := json.NewDecoder(logoResp.Body).Decode(&logoResponse); err != nil {
		return nil, err
	}

	cryptos := make([]models.Crypto, 0, 150)
	for i, coin := range response.Data {
		if i >= 150 {
			break
		}

		cryptos = append(cryptos, models.Crypto{
			Symbol:       coin.Symbol,
			Name:         coin.Name,
			CurrentPrice: coin.Quote.USD.Price,
			LogoUrl:      logoResponse.Data[strconv.Itoa(coin.ID)].Logo,
		})
	}
	return cryptos, nil
}
