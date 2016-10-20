#!/usr/bin/bash
/root/node_modules/pm2/bin/pm2 stop caravel
/root/node_modules/pm2/bin/pm2 delete caravel

python setup.py develop

caravel db upgrade
caravel init

/root/node_modules/pm2/bin/pm2 start `which caravel` --interpreter python  -- runserver