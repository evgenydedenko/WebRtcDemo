docker-compose down
docker image rm webrtcdemo/front
docker image rm webrtcdemo/back

git pull

cd WebRtcDemoFrontend
docker build -t webrtcdemo/front .
cd ..

docker build -t webrtcdemo/back .

docker-compose up -d
