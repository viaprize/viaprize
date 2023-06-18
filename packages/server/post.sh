#!/bin/bash

URL=http://localhost:7300
BODY='{
  "terms": "foo bar",
  "address": "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
  "transactionHash": "0x",
  "blockHash": "0x"
}'

curl -X POST -d "$BODY" -H 'Content-Type: application/json' "$URL/api/pact"
