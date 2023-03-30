import requests
from datetime import datetime

from utils import convert_decimal_to_american
from utils import convert_event_name_nhl
from utils import convert_team_name_nhl


def generate_pointsbet():
    return {
        'nhl': generate_pointsbet_nhl_formatted_events()
    }

# POINTSBET
# NHL
def generate_pointsbet_nhl_formatted_events():
    formatted_events = {}
    url = 'https://api.nj.pointsbet.com/api/v2/competitions/4/events/featured?includeLive=false&page=1'
    try:
        res = requests.get(url).json()
    except:
        print('print error getting url')
        return formatted_events
    try:
        events = res['events']
    except:
        print('error getting events')
        return formatted_events
    for event in events:
        try:
            event_name = convert_event_name_nhl(event['name'])
        except:
            print('error could not find event')
            continue
        formatted_events[event_name] = {'offers': {}}
        try:
            formatted_events[event_name]['start'] = datetime.strptime(event['startsAt'], '%Y-%m-%dT%H:%M:%SZ')
        except ValueError:
            print('error parsing date time')
            formatted_events[event_name]['start'] = None
        try:
            markets = event['specialFixedOddsMarkets']
        except:
            print('could not find markets')
            continue
        for market in markets:
            try:
                label = market['eventName']
            except:
                print('error could not find label')
                continue
            if label == 'Moneyline':
                try:
                    if float(market['outcomes'][0]['price']) == 1 or float(market['outcomes'][1]['price']) == 1:
                        continue
                    formatted_events[event_name]['offers']['Moneyline'] = [{'name': convert_team_name_nhl(outcome['name']), 'odds': convert_decimal_to_american(float(outcome['price']))} for outcome in market['outcomes']]
                except:
                    print('something went wrong adding market moneyline')
    return formatted_events