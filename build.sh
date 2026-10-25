npm --prefix ~/to-do-app run build 
sudo rm -rf /var/www/html/assets .index.html 
sudo cp -r ~/to-do-app/dist/* /var/www/html
