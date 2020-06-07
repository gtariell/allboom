package config

import (
	"database/sql"

	// for mysql
	_ "github.com/go-sql-driver/mysql"
)

// DB function
func DB() *sql.DB {

	/*user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	_db := os.Getenv("DB")*/

	db, _ := sql.Open("mysql", "root:root@tcp(localhost:3306)/newschema")
	err := db.Ping()
	if err != nil {
		panic(err)
	}
	return db
}
