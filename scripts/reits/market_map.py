"""City (and state) -> site market slug, for placing REIT-owned hotels in the site's markets.

One market per city: where the site has a more specific market inside a larger MSA (Orange County
inside Los Angeles; Fort Lauderdale and Palm Beach inside Miami), the specific market wins.
Cities not listed here are shown on REIT pages by city and state, without a market link.
"""

CITY_TO_MARKET = {
    # Arizona
    ("phoenix", "AZ"): "phoenix", ("scottsdale", "AZ"): "phoenix", ("tempe", "AZ"): "phoenix",
    ("mesa", "AZ"): "phoenix", ("chandler", "AZ"): "phoenix", ("glendale", "AZ"): "phoenix",
    ("sedona", "AZ"): "sedona-grand-canyon",
    # California
    ("los angeles", "CA"): "los-angeles", ("beverly hills", "CA"): "los-angeles", ("west hollywood", "CA"): "los-angeles",
    ("santa monica", "CA"): "los-angeles", ("marina del rey", "CA"): "los-angeles", ("long beach", "CA"): "los-angeles",
    ("burbank", "CA"): "los-angeles", ("woodland hills", "CA"): "los-angeles", ("santa clarita", "CA"): "los-angeles",
    ("agoura hills", "CA"): "los-angeles", ("pasadena", "CA"): "los-angeles",
    ("anaheim", "CA"): "anaheim-orange-county", ("garden grove", "CA"): "anaheim-orange-county",
    ("costa mesa", "CA"): "anaheim-orange-county", ("cypress", "CA"): "anaheim-orange-county",
    ("huntington beach", "CA"): "anaheim-orange-county", ("santa ana", "CA"): "anaheim-orange-county",
    ("tustin", "CA"): "anaheim-orange-county", ("aliso viejo", "CA"): "anaheim-orange-county",
    ("foothill ranch", "CA"): "anaheim-orange-county", ("san juan capistrano", "CA"): "anaheim-orange-county",
    ("irvine", "CA"): "anaheim-orange-county", ("newport beach", "CA"): "anaheim-orange-county",
    ("dana point", "CA"): "anaheim-orange-county", ("laguna beach", "CA"): "anaheim-orange-county",
    ("san diego", "CA"): "san-diego", ("la jolla", "CA"): "san-diego", ("del mar", "CA"): "san-diego",
    ("oceanside", "CA"): "san-diego", ("poway", "CA"): "san-diego", ("rancho bernardo/san diego", "CA"): "san-diego",
    ("carlsbad", "CA"): "san-diego", ("coronado", "CA"): "san-diego",
    ("san francisco", "CA"): "san-francisco-bay", ("brisbane", "CA"): "san-francisco-bay", ("san mateo", "CA"): "san-francisco-bay",
    ("fremont", "CA"): "san-francisco-bay", ("sausalito", "CA"): "san-francisco-bay", ("oakland", "CA"): "san-francisco-bay",
    ("burlingame", "CA"): "san-francisco-bay", ("berkeley", "CA"): "san-francisco-bay",
    ("napa", "CA"): "napa-sonoma", ("yountville", "CA"): "napa-sonoma", ("calistoga", "CA"): "napa-sonoma",
    ("sonoma", "CA"): "napa-sonoma", ("healdsburg", "CA"): "napa-sonoma",
    ("palm springs", "CA"): "palm-springs", ("palm desert", "CA"): "palm-springs", ("indian wells", "CA"): "palm-springs",
    ("rancho mirage", "CA"): "palm-springs", ("la quinta", "CA"): "palm-springs",
    ("south lake tahoe", "CA"): "reno-tahoe", ("truckee", "CA"): "reno-tahoe",
    # Colorado
    ("denver", "CO"): "denver", ("englewood", "CO"): "denver", ("glendale", "CO"): "denver", ("highlands ranch", "CO"): "denver",
    ("lone tree", "CO"): "denver", ("aurora", "CO"): "denver", ("aurora, co (denver area)", ""): "denver",
    ("vail", "CO"): "aspen-vail", ("beaver creek", "CO"): "aspen-vail", ("aspen", "CO"): "aspen-vail",
    # DC area
    ("washington", "DC"): "washington-dc", ("washington", "D.C."): "washington-dc", ("washington, d.c.", "-"): "washington-dc",
    ("national harbor, md (washington, dc area)", ""): "washington-dc", ("bethesda", "MD"): "washington-dc",
    ("gaithersburg", "MD"): "washington-dc", ("silver spring", "MD"): "washington-dc", ("national harbor", "MD"): "washington-dc",
    ("alexandria", "VA"): "washington-dc", ("arlington", "VA"): "washington-dc", ("crystal city", "VA"): "washington-dc",
    ("falls church", "VA"): "washington-dc", ("herndon", "VA"): "washington-dc", ("manassas", "VA"): "washington-dc",
    ("springfield", "VA"): "washington-dc", ("vienna", "VA"): "washington-dc", ("reston", "VA"): "washington-dc",
    ("tysons", "VA"): "washington-dc", ("mclean", "VA"): "washington-dc",
    # Florida
    ("orlando", "FL"): "orlando", ("kissimmee", "FL"): "orlando", ("lake buena vista", "FL"): "orlando",
    ("kissimmee, fl (orlando area)", ""): "orlando",
    ("miami", "FL"): "miami", ("miami beach", "FL"): "miami", ("coral gables", "FL"): "miami", ("key biscayne", "FL"): "miami",
    ("fort lauderdale", "FL"): "fort-lauderdale", ("hollywood", "FL"): "fort-lauderdale",
    ("west palm beach", "FL"): "palm-beach", ("boca raton", "FL"): "palm-beach", ("palm beach", "FL"): "palm-beach",
    ("key west", "FL"): "florida-keys", ("marathon", "FL"): "florida-keys", ("key largo", "FL"): "florida-keys",
    ("tampa", "FL"): "tampa", ("st. petersburg", "FL"): "tampa", ("clearwater", "FL"): "tampa",
    ("jacksonville", "FL"): "jacksonville",
    # Georgia
    ("atlanta", "GA"): "atlanta", ("atlanta/downtown", "GA"): "atlanta", ("atlanta/perimeter dunwoody", "GA"): "atlanta",
    ("alpharetta", "GA"): "atlanta", ("buford", "GA"): "atlanta", ("decatur", "GA"): "atlanta", ("marietta", "GA"): "atlanta",
    ("savannah", "GA"): "savannah",
    # Hawaii (Oahu only)
    ("honolulu", "HI"): "honolulu", ("waikiki", "HI"): "honolulu",
    # Illinois / Indiana
    ("chicago", "IL"): "chicago", ("des plaines", "IL"): "chicago", ("hoffman estates", "IL"): "chicago",
    ("mettawa", "IL"): "chicago", ("rosemont", "IL"): "chicago", ("skokie", "IL"): "chicago", ("warrenville", "IL"): "chicago",
    ("merrillville", "IN"): "chicago",
    ("indianapolis", "IN"): "indianapolis",
    # Kansas / Missouri
    ("overland park", "KS"): "kansas-city", ("kansas city", "MO"): "kansas-city", ("kansas city", "KS"): "kansas-city",
    ("st. louis", "MO"): "st-louis",
    # Louisiana
    ("new orleans", "LA"): "new-orleans", ("metairie", "LA"): "new-orleans",
    # Massachusetts
    ("boston", "MA"): "boston", ("cambridge", "MA"): "boston", ("dedham", "MA"): "boston", ("revere", "MA"): "boston",
    ("waltham", "MA"): "boston", ("watertown", "MA"): "boston", ("westford", "MA"): "boston", ("marlborough", "MA"): "boston",
    # Maryland
    ("baltimore", "MD"): "baltimore", ("annapolis", "MD"): "baltimore", ("hunt valley", "MD"): "baltimore",
    # Michigan / Minnesota
    ("novi", "MI"): "detroit", ("detroit", "MI"): "detroit", ("dearborn", "MI"): "detroit",
    ("minneapolis", "MN"): "minneapolis", ("st. paul", "MN"): "minneapolis", ("bloomington", "MN"): "minneapolis",
    ("maple grove", "MN"): "minneapolis",
    # North / South Carolina
    ("charlotte", "NC"): "charlotte", ("durham", "NC"): "raleigh", ("raleigh", "NC"): "raleigh", ("cary", "NC"): "raleigh",
    ("charleston", "SC"): "charleston-sc", ("summerville", "SC"): "charleston-sc",
    ("myrtle beach", "SC"): "myrtle-beach",
    # New Jersey / New York / Pennsylvania (New York MSA includes northern NJ and Long Island)
    ("new york", "NY"): "new-york-city", ("brooklyn", "NY"): "new-york-city", ("garden city", "NY"): "new-york-city",
    ("hauppauge", "NY"): "new-york-city", ("holtsville", "NY"): "new-york-city", ("islip/ronkonkoma", "NY"): "new-york-city",
    ("new rochelle", "NY"): "new-york-city", ("white plains", "NY"): "new-york-city",
    ("branchburg", "NJ"): "new-york-city", ("cranford", "NJ"): "new-york-city", ("mahwah", "NJ"): "new-york-city",
    ("parsippany", "NJ"): "new-york-city", ("somerset", "NJ"): "new-york-city", ("west orange", "NJ"): "new-york-city",
    ("jersey city", "NJ"): "new-york-city",
    ("mount laurel", "NJ"): "philadelphia",
    ("philadelphia", "PA"): "philadelphia", ("collegeville/philadelphia", "PA"): "philadelphia",
    ("malvern/philadelphia", "PA"): "philadelphia",
    ("pittsburgh", "PA"): "pittsburgh",
    # Nevada
    ("las vegas", "NV"): "las-vegas", ("henderson", "NV"): "las-vegas", ("reno", "NV"): "reno-tahoe",
    # Ohio
    ("cleveland", "OH"): "cleveland", ("twinsburg", "OH"): "cleveland", ("mason", "OH"): "cincinnati",
    ("cincinnati", "OH"): "cincinnati", ("columbus", "OH"): "columbus-oh",
    # Oregon / Washington
    ("portland", "OR"): "portland-or", ("hillsboro", "OR"): "portland-or",
    ("seattle", "WA"): "seattle", ("bellevue", "WA"): "seattle", ("kirkland", "WA"): "seattle", ("renton", "WA"): "seattle",
    ("tukwila", "WA"): "seattle",
    # Tennessee
    ("nashville", "TN"): "nashville", ("franklin", "TN"): "nashville",
    ("gatlinburg", "TN"): "gatlinburg-pigeon-forge", ("pigeon forge", "TN"): "gatlinburg-pigeon-forge",
    # Texas
    ("austin", "TX"): "austin", ("austin/round rock", "TX"): "austin", ("round rock", "TX"): "austin",
    ("dallas", "TX"): "dallas", ("fort worth", "TX"): "dallas", ("ft. worth", "TX"): "dallas", ("arlington", "TX"): "dallas",
    ("addison", "TX"): "dallas", ("denton", "TX"): "dallas", ("frisco", "TX"): "dallas", ("grapevine", "TX"): "dallas",
    ("grapevine, tx (dallas area)", ""): "dallas", ("irving", "TX"): "dallas", ("lewisville", "TX"): "dallas",
    ("plano", "TX"): "dallas",
    ("houston", "TX"): "houston", ("shenandoah", "TX"): "houston", ("stafford", "TX"): "houston", ("sugarland", "TX"): "houston",
    ("sugar land", "TX"): "houston", ("the woodlands", "TX"): "houston",
    ("san antonio", "TX"): "san-antonio",
    # Utah / Virginia
    ("salt lake city", "UT"): "salt-lake-city", ("south jordan", "UT"): "salt-lake-city",
    ("virginia beach", "VA"): "virginia-beach-norfolk", ("norfolk", "VA"): "virginia-beach-norfolk",
    ("suffolk", "VA"): "virginia-beach-norfolk", ("williamsburg", "VA"): "williamsburg-va",
}

# Principal-city words used only when a filing lists a hotel by state without a city: the hotel's
# name must contain the city AND the state must match. Reported separately as name-derived matches.
NAME_CITY_HINTS = [
    ("san francisco", "CA", "san-francisco-bay"), ("los angeles", "CA", "los-angeles"), ("santa monica", "CA", "los-angeles"),
    ("beverly hills", "CA", "los-angeles"), ("marina del rey", "CA", "los-angeles"), ("long beach", "CA", "los-angeles"),
    ("hollywood", "CA", "los-angeles"), ("san diego", "CA", "san-diego"), ("la jolla", "CA", "san-diego"),
    ("coronado", "CA", "san-diego"), ("del mar", "CA", "san-diego"), ("newport beach", "CA", "anaheim-orange-county"),
    ("anaheim", "CA", "anaheim-orange-county"), ("irvine", "CA", "anaheim-orange-county"),
    ("dana point", "CA", "anaheim-orange-county"), ("laguna", "CA", "anaheim-orange-county"),
    ("napa", "CA", "napa-sonoma"), ("sonoma", "CA", "napa-sonoma"), ("palm springs", "CA", "palm-springs"),
    ("indian wells", "CA", "palm-springs"), ("palm desert", "CA", "palm-springs"),
    ("lake tahoe", "CA", "reno-tahoe"), ("lake tahoe", "NV", "reno-tahoe"),
    ("phoenix", "AZ", "phoenix"), ("scottsdale", "AZ", "phoenix"), ("tempe", "AZ", "phoenix"), ("sedona", "AZ", "sedona-grand-canyon"),
    ("denver", "CO", "denver"), ("vail", "CO", "aspen-vail"), ("aspen", "CO", "aspen-vail"), ("beaver creek", "CO", "aspen-vail"),
    ("washington", "DC", "washington-dc"), ("georgetown", "DC", "washington-dc"), ("bethesda", "MD", "washington-dc"),
    ("national harbor", "MD", "washington-dc"), ("arlington", "VA", "washington-dc"), ("alexandria", "VA", "washington-dc"),
    ("tysons", "VA", "washington-dc"), ("reston", "VA", "washington-dc"), ("crystal city", "VA", "washington-dc"),
    ("orlando", "FL", "orlando"), ("lake buena vista", "FL", "orlando"), ("kissimmee", "FL", "orlando"),
    ("miami", "FL", "miami"), ("key biscayne", "FL", "miami"), ("fort lauderdale", "FL", "fort-lauderdale"),
    ("boca raton", "FL", "palm-beach"), ("palm beach", "FL", "palm-beach"), ("key west", "FL", "florida-keys"),
    ("key largo", "FL", "florida-keys"), ("tampa", "FL", "tampa"), ("st. petersburg", "FL", "tampa"),
    ("clearwater", "FL", "tampa"), ("jacksonville", "FL", "jacksonville"),
    ("atlanta", "GA", "atlanta"), ("buckhead", "GA", "atlanta"), ("savannah", "GA", "savannah"),
    ("waikiki", "HI", "honolulu"), ("honolulu", "HI", "honolulu"), ("o'ahu", "HI", "honolulu"), ("oahu", "HI", "honolulu"),
    ("chicago", "IL", "chicago"), ("indianapolis", "IN", "indianapolis"), ("new orleans", "LA", "new-orleans"),
    ("boston", "MA", "boston"), ("cambridge", "MA", "boston"), ("baltimore", "MD", "baltimore"),
    ("minneapolis", "MN", "minneapolis"), ("st. paul", "MN", "minneapolis"), ("detroit", "MI", "detroit"),
    ("charlotte", "NC", "charlotte"), ("raleigh", "NC", "raleigh"), ("durham", "NC", "raleigh"),
    ("charleston", "SC", "charleston-sc"), ("new york", "NY", "new-york-city"), ("times square", "NY", "new-york-city"),
    ("manhattan", "NY", "new-york-city"), ("brooklyn", "NY", "new-york-city"), ("jersey city", "NJ", "new-york-city"),
    ("philadelphia", "PA", "philadelphia"), ("pittsburgh", "PA", "pittsburgh"), ("las vegas", "NV", "las-vegas"),
    ("cleveland", "OH", "cleveland"), ("cincinnati", "OH", "cincinnati"), ("columbus", "OH", "columbus-oh"),
    ("portland", "OR", "portland-or"), ("seattle", "WA", "seattle"), ("bellevue", "WA", "seattle"),
    ("nashville", "TN", "nashville"), ("austin", "TX", "austin"), ("dallas", "TX", "dallas"), ("fort worth", "TX", "dallas"),
    ("houston", "TX", "houston"), ("woodlands", "TX", "houston"), ("san antonio", "TX", "san-antonio"),
    ("salt lake city", "UT", "salt-lake-city"), ("virginia beach", "VA", "virginia-beach-norfolk"),
    ("norfolk", "VA", "virginia-beach-norfolk"), ("williamsburg", "VA", "williamsburg-va"), ("kansas city", "MO", "kansas-city"),
    ("st. louis", "MO", "st-louis"),
]

STATE_NAMES = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO",
    "Connecticut": "CT", "Delaware": "DE", "District of Columbia": "DC", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI",
    "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA",
    "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
    "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
    "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD",
    "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA",
    "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY", "Puerto Rico": "PR",
}
