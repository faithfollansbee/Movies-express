#!/bin/bash

API="http://localhost:4741"
URL_PATH="/movies"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "movie": {
      "title": "'"${TITLE}"'",
      "description": "'"${DESCRIPTION}"'",
      "released": "'"${RELEASED}"'",
      "image": "'"${IMAGE}"'",
      "genre": "'"${GENRE}"'"
    }
  }'

echo
