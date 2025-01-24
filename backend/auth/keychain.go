package auth

import (
	"cryptrack/backend/models"
	"encoding/json"
	"fmt"
	"time"

	"github.com/keybase/go-keychain"
)

const (
	service = "com.cryptrack"
	account = "currentUser"
)

func SaveToKeychain(user *models.User) error {
	session := models.UserSession{
		User:      user,
		Timestamp: time.Now(),
	}
	userData, err := json.Marshal(session)
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

	var session models.UserSession
	if err := json.Unmarshal(data[0].Data, &session); err != nil {
		return nil, fmt.Errorf("failed to unmarshal UserSession: %w", err)
	}

	if time.Since(session.Timestamp) > 3*time.Hour {
		DeleteFromKeychain()
		return nil, fmt.Errorf("session expired")
	}

	return session.User, nil
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
