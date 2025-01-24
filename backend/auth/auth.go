package auth

import (
	"cryptrack/backend/db"
	"cryptrack/backend/models"
	"errors"

	"github.com/google/uuid"
)

type AuthService struct {
	db *db.Database
}

func NewAuthService(db *db.Database) *AuthService {
	return &AuthService{db: db}
}

func (s *AuthService) Register(username, password string) (*models.User, error) {
	// if len(password) < 8 {
	// 	return nil, errors.New("password must be at least 8 characters")
	// }

	user := &models.User{
		ID:       uuid.New().String(),
		Username: username,
	}

	if err := user.SetPassword(password); err != nil {
		return nil, err
	}

	if err := s.db.CreateUser(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *AuthService) Login(username, password string) (*models.User, error) {
	user, err := s.db.GetUserByUsername(username)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if !user.CheckPassword(password) {
		return nil, errors.New("invalid password")
	}

	return user, nil
}
