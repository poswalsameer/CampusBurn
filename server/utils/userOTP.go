package utils

import (
	"sync"
	"time"
)

type OTPDetails struct {
	OTP        string
	ExpiryTime time.Time
}

// Thread-safe map for storing OTPs
var OTPStore = struct {
	sync.RWMutex
	Data map[string]OTPDetails
}{
	Data: make(map[string]OTPDetails),
}

func AddOTP(email, otp string, expiry time.Time) {
	OTPStore.Lock()
	defer OTPStore.Unlock()
	OTPStore.Data[email] = OTPDetails{
		OTP:        otp,
		ExpiryTime: expiry,
	}
}

// GetOTP retrieves OTP details by email
func GetOTP(email string) (OTPDetails, bool) {
	OTPStore.RLock()
	defer OTPStore.RUnlock()
	otpDetails, exists := OTPStore.Data[email]
	return otpDetails, exists
}

// DeleteOTP deletes an OTP from the store
func DeleteOTP(email string) {
	OTPStore.Lock()
	defer OTPStore.Unlock()
	delete(OTPStore.Data, email)
}
