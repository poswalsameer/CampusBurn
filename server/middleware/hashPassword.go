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

func CheckPassword(passwordSentByUser string, hashedPasswordInDB string) bool {

	err := bcrypt.CompareHashAndPassword([]byte(hashedPasswordInDB), []byte(passwordSentByUser))

	return err == nil
	//IF THE PASSWORD MATCHES, IT RETURNS nil
	// RETURNS true IF PASSWORD MATCHES, ELSE false

}
