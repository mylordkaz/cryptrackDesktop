//go:build !prod

package config

import (
	"os"
	"path/filepath"
)

func GetPaths(env Environment) (*Paths, error) {
	// Development: use local data directory
	dataDir := "data"
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return nil, err
	}

	return &Paths{
		DataDir:      dataDir,
		DatabasePath: filepath.Join(dataDir, "app.db"),
	}, nil
}

func GetEnvironment() Environment {
	return Development
}
