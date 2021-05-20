# Introduction

ClientSDK enables the 3rd party to query state or perform transactions without requiring a full installation of sifnode or browser.

# Pre-requisites

Client-side SDK is written in typescript. It is used to invoke the REST API with off-line sign feature and broadcast transactions.
The code is provided as an example of participating on sifchain transactions. User must put extra care in ensuring the wallet mnemonic secrets and running environment is protected.

## How to use the SDK

Client-side SDK leverages openapi 3.0 swagger file to auto-generate function stubs to invoke the REST API with appropriate parameters.

1. Pull the latest published openapi spec and generates the new function stubs.
   `npm run nuke-api`

Each of the transactions require downloading of unsigned txn and appropriate sifnode url along with the wallet key in the environment variable.

2. Causes the implemented code to be compiled into javascript and runs the index.js which drives the main application.
   `npm run start`
