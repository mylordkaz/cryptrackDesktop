//go:build prod

package config

import (
	"os"
	"path/filepath"
)

func GetPaths(env Environment) (*Paths, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}

	appDir := filepath.Join(homeDir, "Library", "Application Support", "com.cryptrack")
	if err := os.MkdirAll(appDir, 0700); err != nil {
		return nil, err
	}

	return &Paths{
		DataDir:      appDir,
		DatabasePath: filepath.Join(appDir, "app.db"),
	}, nil
}

func GetEnvironment() Environment {
	return Production
}
