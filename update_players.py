import requests
import json
import os
import time

API_URL = "http://104.247.112.97:25588/api/players/"
JSON_FILE = "all_players_master.json"

def get_rank_from_rating(api_rating):
    val = int(api_rating)
    if val >= 15: return "S+"
    if val == 14: return "S"
    if val == 13: return "S-"
    if val == 12: return "A+"
    if val == 11: return "A"
    if val == 10: return "A-"
    if val == 9:  return "B+"
    if val == 8:  return "B"
    if val == 7:  return "B-"
    if val == 6:  return "C+"
    if val == 5:  return "C"
    if val == 4:  return "C-"
    if val == 3:  return "D+"
    if val == 2:  return "D"
    if val == 1:  return "D-"
    return "E"

def get_username(uuid):
    try:
        url = f"https://sessionserver.mojang.com/session/minecraft/profile/{uuid.replace('-', '')}"
        resp = requests.get(url)
        if resp.status_code == 200:
            return resp.json().get("name")
    except:
        return None
    return None

def main():
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, "r") as f:
            all_players = json.load(f)
    else:
        all_players = []

    # Create a quick-lookup dictionary for existing players
    player_dict = {p['uuid']: p for p in all_players}

    print("Connecting to database API...")
    try:
        response = requests.get(API_URL)
        new_api_data = response.json()
    except Exception as e:
        print(f"Error: {e}")
        return

    total_players = len(new_api_data)
    updated = False

    for i, api_player in enumerate(new_api_data, 1):
        uuid = api_player['uuid']
        api_rating = api_player.get('rating', 0)

        # CASE 1: UUID doesn't exist in our JSON
        if uuid not in player_dict:
            print(f"[{i}/{total_players}] New player found ({uuid}). Querying Mojang...")
            name = get_username(uuid)
            if name:
                api_player['name'] = name
                api_player['rank'] = get_rank_from_rating(api_rating)
                all_players.append(api_player)
                updated = True
                print(f"   -> Added: {name}")
                time.sleep(1.0) # Mojang rate limit protection
            continue

        # CASE 2: UUID exists - check if data actually changed
        local_player = player_dict[uuid]
        
        # We compare the API rating against our stored rating
        # If stats or rating are different, we update
        if local_player.get('rating') != api_rating:
            print(f"[{i}/{total_players}] Update detected for {local_player.get('name')}")
            local_player['rating'] = api_rating
            local_player['rank'] = get_rank_from_rating(api_rating)
            local_player['kills'] = api_player.get('kills', 0)
            local_player['deaths'] = api_player.get('deaths', 0)
            local_player['wins'] = api_player.get('wins', 0)
            local_player['losses'] = api_player.get('losses', 0)
            updated = True
        else:
            # CASE 3: Exists and nothing changed
            # We do nothing and skip to the next player
            pass

    if updated:
        with open(JSON_FILE, "w") as f:
            json.dump(all_players, f, indent=4)
        print("\nSUCCESS: Database updated.")
    else:
        print("\nNo changes detected. JSON remains the same.")

if __name__ == "__main__":
    main()