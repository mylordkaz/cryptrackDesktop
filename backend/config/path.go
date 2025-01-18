package config

import (
	"os"
	"path/filepath"
)

type Environment string

const (
	Development Environment = "development"
	Production  Environment = "production"
)

type Paths struct {
	DataDir      string
	DatabasePath string
}

func GetPaths(env Environment) (*Paths, error) {
	var paths *Paths

	if env == Development {
		// Development: use local data directory
		dataDir := "data"
		if err := os.MkdirAll(dataDir, 0755); err != nil {
			return nil, err
		}

		paths = &Paths{
			DataDir:      dataDir,
			DatabasePath: filepath.Join(dataDir, "app.db"),
		}
	} else {
		// Production: use macOS Library/Application Support
		homeDir, err := os.UserHomeDir()
		if err != nil {
			return nil, err
		}

		appDir := filepath.Join(homeDir, "Library", "Application Support", "com.cryptrack")
		if err := os.MkdirAll(appDir, 0755); err != nil {
			return nil, err
		}

		paths = &Paths{
			DataDir:      appDir,
			DatabasePath: filepath.Join(appDir, "app.db"),
		}
	}

	return paths, nil
}

func GetEnvironment() Environment {
	if os.Getenv("APP_ENV") == "production" {
		return Production
	}
	return Development
}
