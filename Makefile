deploy:
  az account set --subscription ec009fe0-3bdb-47e1-addb-f213dda335b6
  npm ci
  npm run build --if-present
  func azure functionapp publish simiriki-fn-prod --no-build
