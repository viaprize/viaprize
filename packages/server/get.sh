#!/bin/bash

URL=http://localhost:7300

ADDRESS=0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5

curl "$URL/api/pact?address=$ADDRESS"
