#!/usr/bin/env bash

set -e

# Colors for output - store clean versions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check dependencies
check_deps() {
  local missing=()
  command -v jq >/dev/null 2>&1 || missing+=("jq")
  command -v curl >/dev/null 2>&1 || missing+=("curl")
  command -v speedtest >/dev/null 2>&1 || missing+=("speedtest (brew install speedtest)")
  
  if [ ${#missing[@]} -ne 0 ]; then
    echo -e "${RED}Error: Missing required dependencies: ${missing[*]}${NC}"
    exit 1
  fi
}

# Load API key from .env
load_api_key() {
  if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
  fi
  
  if [ -z "$GOOGLE_PLACES_API_KEY" ]; then
    echo -e "${RED}Error: GOOGLE_PLACES_API_KEY not found in environment or .env file${NC}"
    exit 1
  fi
}

# Convert day number to name (0=Sunday)
day_num_to_name() {
  case $1 in
    0) echo "sun" ;;
    1) echo "mon" ;;
    2) echo "tue" ;;
    3) echo "wed" ;;
    4) echo "thu" ;;
    5) echo "fri" ;;
    6) echo "sat" ;;
  esac
}

# Format time
format_time() {
  local hour=$1
  local minute=$2
  if [ "$minute" = "0" ]; then
    echo "$hour"
  else
    echo "${hour}:${minute}"
  fi
}

# Prompt for a numeric rating (0-5), returns valid result only
prompt_rating() {
  local field=$1
  local value
  
  while true; do
    read -r -p "$field (0-5, Enter for empty): " value
    if [ -z "$value" ]; then
      echo ""
      return
    fi
    if [[ "$value" =~ ^[0-5]$ ]]; then
      echo "$value"
      return
    fi
    echo -e "${YELLOW}Please enter a number between 0-5${NC}" >&2
  done
}

# Prompt for boolean (true/false/empty), returns valid result only
prompt_bool() {
  local field=$1
  local value
  
  while true; do
    read -r -p "$field (true/false/Enter for empty): " value
    if [ -z "$value" ]; then
      echo ""
      return
    fi
    if [ "$value" = "true" ] || [ "$value" = "false" ]; then
      echo "$value"
      return
    fi
    echo -e "${YELLOW}Please enter 'true', 'false', or leave empty${NC}" >&2
  done
}

# Generate slug from name
generate_slug() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | tr -d "'" | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//'
}

# Round to 7 decimal places
round_coord() {
  printf "%.7f" "$1"
}

# Run speedtest and return just the rounded speed value
run_speedtest() {
  local run_test
  read -r -p "Are you connected to the cafe's WiFi? (y/n): " run_test
  
  if [ "$run_test" = "y" ] || [ "$run_test" = "Y" ]; then
    echo -e "${BLUE}Running speedtest...${NC}" >&2
    
    local result
    if result=$(speedtest --json 2>/dev/null); then
      local download_mbps=$(echo "$result" | jq -r '.download // empty')
      if [ -n "$download_mbps" ] && [ "$download_mbps" != "null" ] && [ "$download_mbps" != "0" ]; then
        local mbps=$(echo "$download_mbps" | awk '{printf "%.0f", $1 / 1000000}')
        local nearest_10=$(( (mbps + 5) / 10 * 10 ))
        echo -e "${GREEN}Speed: ${mbps} Mbps (rounded to ${nearest_10})${NC}" >&2
        echo "$nearest_10"
        return
      fi
    fi
    
    echo -e "${YELLOW}Speedtest failed. Skipping...${NC}" >&2
  fi
}

# Handle images - just create folder and collect filenames
handle_images() {
  local city=$1
  local slug=$2
  local image_dir="images/$city/$slug"
  
  mkdir -p "$image_dir"
  
  # Print info to stderr so it doesn't get captured
  echo "" >&2
  echo "Image folder created: $image_dir" >&2
  
  read -r -p "Enter image filenames (space-separated, e.g., seating.jpg interior.jpg), or press Enter to skip: " image_names
  
  if [ -z "$image_names" ]; then
    # Still return empty yaml structure
    echo ""
    return
  fi
  
  local images_yaml=""
  for name in $image_names; do
    images_yaml+="  - $name
"
  done
  
  echo "" >&2
  echo "Please manually copy your images to: $image_dir" >&2
  echo "Then run: npm run resize" >&2
  
  echo "$images_yaml"
}

# Main function
main() {
  check_deps
  load_api_key
  
  # Get city from argument
  if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide a city name as the first argument${NC}"
    echo "Usage: ./import.sh <city-name>"
    echo ""
    echo "Available cities:"
    ls -1 data/
    exit 1
  fi
  
  local city_input=$(echo "$1" | tr '[:upper:]' '[:lower:]')
  local city=""
  
  for dir in data/*/; do
    local dirname=$(basename "$dir")
    if [ "$dirname" = "$city_input" ]; then
      city="$dirname"
      break
    fi
  done
  
  if [ -z "$city" ]; then
    echo -e "${RED}Error: City '$1' not found${NC}"
    echo "Available cities:"
    ls -1 data/
    exit 1
  fi
  
  echo -e "${GREEN}Selected city: $city${NC}"
  
  read -r -p "Enter cafe name (e.g., Tully's Takebashi): " cafe_name
  
  if [ -z "$cafe_name" ]; then
    echo -e "${RED}Error: Cafe name is required${NC}"
    exit 1
  fi
  
  local slug=$(generate_slug "$cafe_name")
  local output_file="data/$city/$slug.md"
  
  if [ -f "$output_file" ]; then
    echo -e "${YELLOW}Warning: A place with slug '$slug' already exists at $output_file${NC}"
    read -r -p "Continue anyway? (y/n): " continue_anyway
    if [ "$continue_anyway" != "y" ]; then
      exit 0
    fi
  fi
  
  echo -e "${BLUE}Searching Google Places for: $cafe_name...${NC}"
  
  local api_response
  api_response=$(curl -s --request POST \
    --url https://places.googleapis.com/v1/places:searchText \
    --header 'Content-Type: application/json' \
    --header "X-Goog-Api-Key: $GOOGLE_PLACES_API_KEY" \
    --header 'X-Goog-FieldMask: places.displayName,places.formattedAddress,places.googleMapsUri,places.location,places.regularOpeningHours,places.nationalPhoneNumber,places.websiteUri' \
    --data "{\"textQuery\": \"$cafe_name\", \"regionCode\": \"JP\", \"languageCode\": \"en\"}")
  
  local error_msg=$(echo "$api_response" | jq -r '.error.message // empty')
  if [ -n "$error_msg" ]; then
    echo -e "${RED}API Error: $error_msg${NC}"
    exit 1
  fi
  
  local places_count=$(echo "$api_response" | jq '.places | length')
  if [ "$places_count" -eq 0 ]; then
    echo -e "${YELLOW}No results found for '$cafe_name'${NC}"
    read -r -p "Try a different search term? (or press Enter to exit): " new_search
    exit 0
  fi
  
  local place=$(echo "$api_response" | jq '.places[0]')
  
  local official_name=$(echo "$place" | jq -r '.displayName.text // empty')
  local address=$(echo "$place" | jq -r '.formattedAddress // empty')
  local lat=$(echo "$place" | jq -r '.location.latitude // empty')
  local lng=$(echo "$place" | jq -r '.location.longitude // empty')
  local maps_url=$(echo "$place" | jq -r '.googleMapsUri // empty')
  local phone=$(echo "$place" | jq -r '.nationalPhoneNumber // empty')
  local website=$(echo "$place" | jq -r '.websiteUri // empty')
  local hours_json=$(echo "$place" | jq '.regularOpeningHours.periods // empty')
  
  echo -e "${GREEN}Found: $official_name${NC}"
  echo "Address: $address"
  
  if [ -n "$lat" ] && [ -n "$lng" ]; then
    lat=$(round_coord "$lat")
    lng=$(round_coord "$lng")
  fi
  echo "Coordinates: $lat,$lng"
  
  local today=$(date +%Y-%m-%d)
  
  # Build hours using individual variables (no associative arrays)
  local hours_mon="" hours_tue="" hours_wed="" hours_thu="" hours_fri="" hours_sat="" hours_sun=""
  
  if [ -n "$hours_json" ] && [ "$hours_json" != "null" ]; then
    local tmpfile=$(mktemp)
    echo "$hours_json" | jq -c '.[]' > "$tmpfile"
    
    while IFS= read -r period; do
      [ -z "$period" ] && continue
      local open_day=$(echo "$period" | jq -r '.open.day')
      local open_hour=$(echo "$period" | jq -r '.open.hour')
      local open_min=$(echo "$period" | jq -r '.open.minute // 0')
      local close_hour=$(echo "$period" | jq -r '.close.hour')
      local close_min=$(echo "$period" | jq -r '.close.minute // 0')
      
      local day_name=$(day_num_to_name "$open_day")
      local open_time=$(format_time "$open_hour" "$open_min")
      local close_time=$(format_time "$close_hour" "$close_min")
      local hours_val="$open_time-$close_time"
      
      case $day_name in
        mon) hours_mon="$hours_val" ;;
        tue) hours_tue="$hours_val" ;;
        wed) hours_wed="$hours_val" ;;
        thu) hours_thu="$hours_val" ;;
        fri) hours_fri="$hours_val" ;;
        sat) hours_sat="$hours_val" ;;
        sun) hours_sun="$hours_val" ;;
      esac
    done < "$tmpfile"
    rm -f "$tmpfile"
  fi
  
  # Build hours YAML with proper newlines
  local hours_yaml=""
  for day in mon tue wed thu fri sat sun; do
    local day_val
    case $day in
      mon) day_val="$hours_mon" ;;
      tue) day_val="$hours_tue" ;;
      wed) day_val="$hours_wed" ;;
      thu) day_val="$hours_thu" ;;
      fri) day_val="$hours_fri" ;;
      sat) day_val="$hours_sat" ;;
      sun) day_val="$hours_sun" ;;
    esac
    if [ -n "$day_val" ]; then
      hours_yaml+="  $day: $day_val
"
    else
      hours_yaml+="  $day:
"
    fi
  done
  
  # Collect subjective ratings
  echo ""
  echo -e "${BLUE}--- Subjective Ratings (0-5 scale) ---${NC}"
  
  local wifi=$(prompt_rating "WiFi quality")
  
  local speed=""
  if [ -n "$wifi" ] && [ "$wifi" != "0" ]; then
    speed=$(run_speedtest)
  fi
  
  local power=$(prompt_rating "Power outlet availability")
  local vacancy=$(prompt_rating "Vacancy (ease of getting a seat)")
  local comfort=$(prompt_rating "Comfort (seats, temperature)")
  local quiet=$(prompt_rating "Quietness")
  local food=$(prompt_rating "Food quality/selection")
  local drinks=$(prompt_rating "Drinks quality/selection")
  local price=$(prompt_rating "Price/value for money")
  local view=$(prompt_rating "View/ambiance/vibe")
  local toilets=$(prompt_rating "Toilets availability/quality")
  
  echo ""
  echo -e "${BLUE}--- Boolean Features ---${NC}"
  local music=$(prompt_bool "Music")
  local smoking=$(prompt_bool "Smoking allowed")
  local standing_tables=$(prompt_bool "Standing tables")
  local outdoor_seating=$(prompt_bool "Outdoor seating")
  local cash_only=$(prompt_bool "Cash only")
  local animals=$(prompt_bool "Animals/pets allowed")
  local lactose_free_milk=$(prompt_bool "Lactose-free milk available")
  local time_limit=$(prompt_bool "Time limit for staying")
  
  # Additional info
  echo ""
  read -r -p "Area/District: " area
  read -r -p "Nearby station: " station
  read -r -p "Instagram URL (optional): " instagram
  read -r -p "Facebook URL (optional): " facebook
  
  # Get description - single line with return to finish
  echo ""
  read -r -p "Description (press Enter to finish): " description
  
  # Handle images
  local images_yaml=$(handle_images "$city" "$slug")
  
  # Build the markdown file
  cat > "$output_file" << EOF
---
added: $today
name: ${official_name:-$cafe_name}
type: Cafe
area: ${area}
google_maps: ${maps_url}
coordinates: ${lat},${lng}
address: ${address}
station: ${station}
hours:
${hours_yaml}wifi: ${wifi}
EOF

  # Append speed if present
  if [ -n "$speed" ]; then
    echo "speed: ${speed}" >> "$output_file"
  fi
  
  # Continue with the rest
  cat >> "$output_file" << EOF
power: ${power}
vacancy: ${vacancy}
comfort: ${comfort}
quiet: ${quiet}
food: ${food}
drinks: ${drinks}
price: ${price}
view: ${view}
toilets: ${toilets}
music: ${music}
smoking: ${smoking}
standing_tables: ${standing_tables}
outdoor_seating: ${outdoor_seating}
cash_only: ${cash_only}
animals: ${animals}
lactose_free_milk: ${lactose_free_milk}
time_limit: ${time_limit}
facebook: ${facebook}
instagram: ${instagram}
telephone: ${phone}
images:
${images_yaml}---

${description}
EOF
  
  echo ""
  echo -e "${GREEN}✓ Place saved to: $output_file${NC}"
  
  echo -e "${BLUE}Running validation...${NC}"
  npm test 2>&1 | tail -5 || echo -e "${YELLOW}Validation had warnings, please check${NC}"
}

main "$@"
