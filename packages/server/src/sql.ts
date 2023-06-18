export const statements = {
  createTable: `
  CREATE TABLE IF NOT EXISTS pacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255),
    terms TEXT,
    address VARCHAR(42) UNIQUE,
    transactionHash VARCHAR(66) UNIQUE,
    blockHash VARCHAR(66)
  );
  `,
  insertPact: `
  INSERT INTO pacts (name, terms, address, transactionHash, blockHash)
  VALUES ($name, $terms, $address, $transactionHash, $blockHash);
  `,
  getPact: `
  SELECT * FROM pacts WHERE address = $address;
  `,
  getPacts: `
  SELECT * FROM pacts;
  `,
}
