server {
        listen 80;
	server_name medapp1.ru www.medapp1.ru;
                root /var/www/medapp1.ru/public/;
		index index.html index.htm index.nginx-debian.html;
        access_log off;
                error_log /var/log/nginx/medapp1.ru.log error;
 
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
 
        location ~* \.(jpg|jpeg|gif|png|ico|txt|woff|otf|eot|svg|ttf|html|xml|css|js)$ {
                expires 30d;
                error_page 404 @notfound;
        }
 
        location / {
                proxy_pass http://127.0.0.1:3007;
                proxy_redirect off;
        }
 
        location @notfound {
                proxy_pass http://localhost:3007$request_uri;
        }
 
}
#server {
#         server_name "~^www\.(.*)$";
#         return 301 $scheme://$1$request_uri;
#}
