#!/bin/bash

# read env
envkey=`cat env.js | grep : | awk -F '"' '{print $2}'`
linecount=0
echo "var ENV = {" > env.js
for key in $envkey
do
if [ $linecount -ge 1 ]; then
echo "," >> env.js
fi
linecount=$[$linecount+1];
echo -n "\"$key\": \"" >> env.js
eval echo -n "\${$key}" >> env.js
echo -n "\"" >> env.js
done
echo "" >> env.js
echo "};" >> env.js

ls -al /var/static/dist
exec "$@"

