## Sakagiri
#### a discord bot, for toram online

cuz why not

<hr>

### run
- ``npm start``

### require

- nodejs >= 14.16
- a discord bot token
- a data file (below)

<hr>

## setup

#### install dependencies
- run ``npm i``

#### configuration

**local variables**

- ``DISCORD_BOT_TOKEN`` - the bot token (required)
- ``DISCORD_DATA_URL`` - url/path to data file (required)
- ``DISCORD_MAX_THREADS`` - number of threads to run (default 2)

**config file**

you can modify your config in [Config.js](./Sakagiri/Config.js)

<hr>

## data file
a data file is required to run the bot which is loaded via ``DISCORD_DATA_URL`` env variable

the ``DISCORD_DATA_URL`` can either be a valid URL to the file, or path to a local file

a valid data file looks like:
```Json
{
    "version": 123456,
    "index": [
        "Item data goes here"
    ],
    "toram": {
        "level_cap": 230,
        "game_tips": [
            "some game tip",
        ],
        "ignore_leveling_id": [
            "some mob id",
        ],
        "ignore_leveling_name": [
            "some mob name",
        ],
        "ignore_leveling_maps": [
            "some map name",
        ]
    }
}
```
## item types
#### item type: Item
```Json
{
    "id": "T69",
    "name": "Test item",
    "type": "Katana",
    "sell": "0",
    "proc": "unknown",
    "stats": [
        "Base ATK 69",
        "ASPD 69",
        "Critical Rate 69",
        "Attack MP Recovery 69",
        "Base Stability % 69"
    ],
    "drops": [
        {
            "from": "E69",
            "dyes": [
                "990000",
                "c0c0c0",
                "c0c0c0"
            ] 
        }
    ],
    "uses": [
        {
            "for": "T69",
            "amount": 1
        }
    ],
    "recipe": {
        "fee": 100,
        "set": 1,
        "level": 1,
        "difficulty": 1,
        "materials": [
            {
                "item": "T1",
                "amount": 1
            }
        ]
    }
}
```
#### item type: Monster
```Json
{
      "id": "E69",
      "name": "Test monster",
      "level": 269,
      "type": "Boss - Ultimate",
      "hp": 6900000,
      "ele": "Light",
      "exp": 69000,
      "tamable": "No",
      "map": "M69",
      "drops": [
        {
            "id": "T69",
            "dyes": [
                "990000",
                "c0c0c0",
                "c0c0c0"
            ] 
        }
    ]
}
```
#### item type: Map
```Json
{
    "id": "M69",
    "name": "Test map",
    "type": "Map",
    "mobs": [
        "E69"
    ]
}
```
<hr>

## credits

- data source: [Coryn club](https://coryn.club/)

p/s: name taken from *CP: Another Child*
