# WebRtcDemoBackend

# Docker

To build and run this project in docker use following commands:
`docker build -t webrtcdemo/back .`
`docker run -d -p 4201:80 -e ASPNETCORE_ENVIRONMENT=docker webrtcdemo/back`
