#!/bin/bash
URL=/
curl "http://localhost:3000$URL" -s 2>&1 | tr '<' '\n<' > a.html
curl "https://cafeandcowork.com$URL" -s 2>&1 | tr '<' '\n<' > b.html
