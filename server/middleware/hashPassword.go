package middleware

import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	// DefaultCost means 2^10 = 1024 rounds of hashing are done

	if err != nil {
		return "", err
	}

	return string(hashedPassword), nil

}
