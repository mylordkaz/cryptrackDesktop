package auth

import (
	"cryptrack/backend/models"
	"encoding/json"
	"fmt"

	"github.com/keybase/go-keychain"
)

const (
	service = "com.cryptrack"
	account = "currentUser"
)

func SaveToKeychain(user *models.User) error {
	userData, err := json.Marshal(user)
	if err != nil {
		return fmt.Errorf("failed to marshal user: %w", err)
	}

	item := keychain.NewItem()
	item.SetSecClass(keychain.SecClassGenericPassword)
	item.SetService(service)
	item.SetAccount(account)
	item.SetData(userData)
	item.SetAccessible(keychain.AccessibleWhenUnlocked)

	return keychain.AddItem(item)
}

func LoadFromKeychain() (*models.User, error) {
	query := keychain.NewItem()
	query.SetSecClass(keychain.SecClassGenericPassword)
	query.SetService(service)
	query.SetAccount(account)
	query.SetMatchLimit(keychain.MatchLimitOne)
	query.SetReturnData(true)

	data, err := keychain.QueryItem(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query keychain: %w", err)
	}

	if len(data) == 0 {
		return nil, fmt.Errorf("no keychain item found")
	}

	var user models.User
	if err := json.Unmarshal(data[0].Data, &user); err != nil {
		return nil, fmt.Errorf("failed to unmarshal user: %w", err)
	}

	return &user, nil
}

func DeleteFromKeychain() error {
	item := keychain.NewItem()
	item.SetSecClass(keychain.SecClassGenericPassword)
	item.SetService(service)
	item.SetAccount(account)
	item.SetAccessible(keychain.AccessibleWhenUnlocked)

	err := keychain.DeleteItem(item)
	return err
}
