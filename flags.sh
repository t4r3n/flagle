#!/bin/bash

# Download flags from flagcdn.com for all countries
# Organized by continent for the game

# North America (23 countries)
NORTH_AMERICA="ag ai aw bb bm bs bz ca cr cu dm do gd gt hn ht jm kn lc mx ni pa sv tc tt us vc"

# South America (12 countries)
SOUTH_AMERICA="ar bo br cl co ec gy pe py sr uy ve"

# Europe (44 countries)
EUROPE="ad al at ba be bg by ch cy cz de dk ee es fi fr gb gr hr hu ie is it li lt lu lv mc md me mk mt nl no pl pt ro rs se si sk sm ua va xk"

# Africa (54 countries)
AFRICA="ao bf bi bj bw cd cf cg ci cm cv dj dz eg er et ga gh gm gn gq gw ke km lr ls ly ma mg ml mr mu mw mz na ne ng rw sc sd sl sn so ss st sz td tg tn tz ug za zm zw"

# Asia & Oceania (47 countries)
ASIA_OCEANIA="ae af am au az bd bn bt cn fj ge hk id il in iq ir jo jp kg kh kr kw kz la lb lk mm mn mo mv my np nz om ph pk ps qa ru sa sg sy th tj tk tm tr tw uz vn ws ye"

ALL_CODES="$NORTH_AMERICA $SOUTH_AMERICA $EUROPE $AFRICA $ASIA_OCEANIA"

echo "Downloading flags..."
mkdir -p ./public/flags

for code in $ALL_CODES; do
  if [ ! -f "./public/flags/${code}.svg" ]; then
    curl -s "https://flagcdn.com/${code}.svg" -o "./public/flags/${code}.svg"
    echo "Downloaded ${code}.svg"
  else
    echo "Skipped ${code}.svg (already exists)"
  fi
done

echo "Done! Downloaded flags to ./public/flags/"
