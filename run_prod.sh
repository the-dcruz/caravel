#!/usr/bin/bash

python setup.py develop

caravel db upgrade
caravel init

/root/node_modules/pm2/bin/pm2 start `which caravel` --interpreter python  -- runserver