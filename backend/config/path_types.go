package config

type Environment string

const (
	Development Environment = "development"
	Production  Environment = "production"
)

type Paths struct {
	DataDir      string
	DatabasePath string
}
