// SQL Injection vulnerability
// user input directly concatenated into query

const getUser = (username) => {
  const query = "SELECT * FROM users WHERE username = '" + username + "'"
  return db.execute(query)
}

// attacker can pass: ' OR '1'='1
// results in: SELECT * FROM users WHERE username = '' OR '1'='1'