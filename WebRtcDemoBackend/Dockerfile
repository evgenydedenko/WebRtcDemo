#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["WebRtcDemoBackend/WebRtcDemoBackend.csproj", "WebRtcDemoBackend/"]
RUN dotnet restore "WebRtcDemoBackend/WebRtcDemoBackend.csproj"
COPY . .
WORKDIR "/src/WebRtcDemoBackend"
RUN dotnet build "WebRtcDemoBackend.csproj" -c Release -o /app/build
RUN dotnet publish "WebRtcDemoBackend.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "WebRtcDemoBackend.dll"]
