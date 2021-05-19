# List of Commands

## Default prefix **-s**

<hr>

### -s help (Main help command)

Print main help page of Sakagiri

**Use** ``-s help``

<hr>

### -s search (Search command)
Search for items, print out item's info if only one was found or search value is an ID

**Use** ``-s search/<empty> [value] [args]``

+ `` [value] `` - The value you want to search for, can be a string or a number
+ `` [args] `` - Additional arguments & values (if any), list below

**Arguments**

+ `` -p/--page [page] `` - Search for items in the given page, if any (only works if the total items found is over 20)
+ `` -t/--type [type, ...] `` - Search for items with given types, [type] cannot contain numbers and if [types] has multiple words, please put them in double-quotes `` "[type]" ``, you can also add multiple types by adding them between `` ; `` and it will return results with matching types, more examples below
+ `` -f/--filter [comparator, ...] `` - Search for items that has the matching stats (works with **Sell/Process/Item stats** values), [comparator] has format of `` stat_name >|<|=|>=|<= number_value ``, you can add multiple [comparator] by adding them between `` ; ``, if [comparator] has spaces in it, please put it inside double-quotes, ex: `` "atk % >= 8" ``, more examples below

All arguments can be used at the same time, and ``s/search`` can be removed

+ ``-s s * -t "en cry" -f "atk % >= 8" -p 1`` or ``-s * -t "en cry" -f "atk % >= 8" -p 1``

Using with the **--type** tag

+ ``-s * -t "sword"`` ===> return a list of results with matching type of "1 handed sword" and "2 handed sword"
+ ``-s * -t "sword; staff"`` ===> return a list of results with matching type of "1 handed sword", "2 handed sword" and "staff"
+ ``-s * -t "=1 handed sword"`` ===> you can also search for items with **EXACT** type by adding ``=`` in front of a type
+ ``-s * -t "=bow"`` ===> return a list of results with **EXACT** matching type of "bow"

Using with the **--filter** tag

+ ``-s * -f atk>=10`` ===> return a list of results with "ATK" stat that is *higher or equals* (>=) to 10
+ ``-s * -f atk<=10`` ===> you can also search for items with stats that are *equal* (=), *lower or equal* (<=), *lower* (<)
+ ``-s * -f "atk % < 8"`` ===> return a list of results with "ATK %" stat that is *lower* (<) than 10
+ ``-s * -f "atk % >= 8; critical rate = 20"`` ===return a list of results with "ATK %" that is *higher or equal* (>=) to 8 AND "Critical Rate" that is *equal* (=) to 20
+ ``-s * -f "proc beast > 69"`` ===> you can also search for items by process value by using ``"proc [material_type] <= [number]"``
+ ``-s * -f "proc mana >= 100"`` ===> return a list of results with "Mana process" value is *higher or equal* (>=) to 100
+ ``-s * -f "sell >= 1000"`` ===> you can also search for items by sell value by using ``"sell > [number]"``

<hr>

### -s lvl (Level guide command)

Show a list of detailed leveling guide based on given level(s)

**Use** ``-s level/lvl <from_level> [to_level] [args]``

+ `` <from_level> `` - Starting level
+ `` [to_level] `` - Destination level (Optional)
+ `` [args] `` - Additional arguments & values (if any), list below

**Arguments**

+ `` -e/--exp [bonus] `` - Calculate output with extra exp bonus% given from [bonus], if no [bonus] defined, bonus% will be 50 (daily emblems)
+ `` -a/--auto `` - Calculate output with auto-measured exp bonus% based on each level, recommended if [to_level] is defined
+ `` -b/--boss `` - Filter output to Boss(es) only
+ `` -m/--mini `` - Filter output to Mini-boss(es) only
+ `` -M/--mob `` - Filter output to Normal monsters only
+ `` -n/--normal `` - Filter output to Normal bosses only
+ `` -h/--hard `` - Filter output to Hard bosses only
+ `` -nm/--nightmare `` - Filter output to Nightmare bosses only
+ `` -u/--ultimate `` - Filter output to Ultimate bosses only
+ `` -pm `` - Send results to your pm

All arguments can be used at the same time

+ `` -s lvl 150 200 -b -a -e 69 -pm ``
