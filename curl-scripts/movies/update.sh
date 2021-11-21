#!/bin/bash

API="http://localhost:4741"
URL_PATH="/movies"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
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
