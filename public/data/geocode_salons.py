import json
import time
import requests

# --- Configuration ---
INPUT_FILE = 'salons.json'
OUTPUT_FILE = 'salons_geocoded.json'
# Use your Geocoding accurate API key
API_KEY = "DOOLgURuLYrfw48OutpWIq1Ne2kQ2GO1ujFPBT3C0Aqr7yuNUkotPZNtvXsAJHOq"
# The correct endpoint URL you provided
GEOCODING_URL = "https://api.distancematrix.ai/maps/api/geocode/json"

# --- Helper function to geocode a single address ---
def geocode_address(full_address, api_key):
    """
    Sends an address to the API and returns lat/lon.
    Returns (lat, lon) on success, or (None, None) on failure.
    """
    params = {
        'address': full_address,
        'key': api_key
    }
    try:
        print(f"Geocoding: {full_address}")
        response = requests.get(GEOCODING_URL, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()

        # Parse the response based on the structure you provided
        if data.get('status') == 'OK' and data.get('result'):
            location = data['result'][0]['geometry']['location']
            lat = location['lat']
            lon = location['lng']
            return lat, lon
        else:
            print(f"  API Error: {data.get('status')} - No results found.")
            return None, None

    except requests.exceptions.RequestException as e:
        print(f"  Request failed: {e}")
        return None, None
    except (KeyError, IndexError) as e:
        print(f"  Failed to parse response: {e}")
        return None, None

# --- Main script ---
def main():
    # 1. Load the salon data
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            salons = json.load(f)
    except FileNotFoundError:
        print(f"Error: {INPUT_FILE} not found. Please create it from the previous response.")
        return
    except json.JSONDecodeError:
        print(f"Error: {INPUT_FILE} is not valid JSON.")
        return

    print(f"Loaded {len(salons)} salons to geocode.")

    # 2. Geocode each salon
    for i, salon in enumerate(salons):
        # Create a full address string.
        if salon['address'] and salon['address'] != salon['suburb']:
            # If address contains more than just the suburb (e.g., has a street)
            full_address = f"{salon['address']}, {salon['state']} {salon['postcode']}, Australia"
        else:
            # Use suburb as the main part of the address
            full_address = f"{salon['suburb']}, {salon['state']} {salon['postcode']}, Australia"

        lat, lon = geocode_address(full_address, API_KEY)

        # Update the salon dictionary with the new data
        salon['lat'] = lat
        salon['lon'] = lon

        # Be polite to the API - don't send requests too fast
        time.sleep(0.2)  # Wait 200ms between requests

    # 3. Save the updated data to a new JSON file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(salons, f, indent=2, ensure_ascii=False)

    print(f"Geocoding complete. Results saved to {OUTPUT_FILE}")

    # Optional: Count successes
    successful = sum(1 for s in salons if s.get('lat') is not None)
    print(f"Successfully geocoded {successful} out of {len(salons)} salons.")

if __name__ == "__main__":
    main()