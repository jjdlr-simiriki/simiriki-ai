# Azure Function Deployment Guide

This document outlines how to deploy the **simiriki** Azure Function, configure environment variables, and validate your setup. Follow these steps to get your backend running in production.

## 1. Initial Infrastructure Setup

Use the Azure CLI to create the required resources and assign permissions:

- Set your subscription and resource group.
- Create a Storage account for the Function (`AzureWebJobsStorage`).
- (Optional) Create an Application Insights resource.
- Create the Function App in Consumption plan.
- Enable the managed identity on the Function App.
- Assign roles: **Key Vault Secrets User** and **Storage Blob Data Contributor** to the managed identity.

A sample script is provided below:

```bash
SUBSCRIPTION="ec009fe0-3bdb-47e1-addb-f213dda335b6"
RG="simiriki-ops"
LOC="eastus"
APPNAME="simiriki-fn-prod"
STOR="simirikifnprod$(openssl rand -hex 3)"

az account set --subscription "$SUBSCRIPTION"
az group create -n "$RG" -l "$LOC"
az storage account create -n "$STOR" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2
az functionapp create -g "$RG" -n "$APPNAME" --storage-account "$STOR" --consumption-plan-location "$LOC"
az functionapp identity assign -g "$RG" -n "$APPNAME"
# Assign roles here...
```

## 2. Environment Variables via Key Vault

Store secrets such as your OpenAI API key, webhook secret, and Azure Communication Services connection string in a Key Vault. Reference them in your Function App settings using KeyVault references:

```bash
OPENAI_API_KEY="@Microsoft.KeyVault(SecretUri=<kv-secret-uri>)"
WEBHOOK_SECRET="@Microsoft.KeyVault(SecretUri=<kv-secret-uri>)"
ACS_CONNECTION_STRING="@Microsoft.KeyVault(SecretUri=<kv-secret-uri>)"
```

Be sure to set `AzureWebJobsStorage` to the storage connection string created above.

## 3. CI/CD with GitHub Actions

This repository includes a workflow in `.github/workflows/deploy-function.yml` that builds and deploys the Function on every push to `main` or on demand. The workflow uses OIDC authentication with GitHub to log in to Azure. Ensure the following repo variables are defined in GitHub:

- `AZURE_TENANT_ID`
- `AZURE_CLIENT_ID`
- `AZURE_SUBSCRIPTION_ID`

Set `FUNCTIONAPP_NAME` and `RESOURCE_GROUP` in the workflow to match your deployment.

## 4. Manual Deployment

If you prefer a local deployment, install **Azure Functions Core Tools** and run:

```bash
npm ci && npm run build
az account set --subscription "$SUBSCRIPTION"
func azure functionapp publish "$APPNAME" --no-build
```

## 5. Authorize ACS Email Sender

If your Function sends emails via Azure Communication Services, make sure your domain is verified and the sender is created:

```bash
az communication email domain list -g "$RG" --communication-service-name "$ACS_NAME"
az communication email sender-username create -g "$RG" --communication-service-name "$ACS_NAME" --domain "<verified-domain>" --username "contacto"
```

Confirm that the sender appears as **Active** before sending email.

## 6. Additional Storage

If your application uses another Storage account for data beyond the Functions runtime, create it and grant the managed identity access:

```bash
DATA_STOR="simirikidata$(openssl rand -hex 3)"
az storage account create -n "$DATA_STOR" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2
az role assignment create --assignee-object-id "$MI_PRINCIPAL_ID" --role "Storage Blob Data Contributor" --scope $(az storage account show -n "$DATA_STOR" -g "$RG" --query id -o tsv)
```

Add any connection strings or account URLs to your Function App settings as needed.

---

Following these steps ensures a reproducible, secure deployment of your Azure Function.
