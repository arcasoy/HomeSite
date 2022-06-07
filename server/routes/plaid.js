var express = require('express');
var router = express.Router();
router.use(express.json());

require('dotenv').config();

const {Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

router.post('/api/create_link_token', async function (req, res) {
  //Get the client_user_id by searching for the current user
  // const user = await User.find();
  // const clientUserId = user.id;
  req = {
    user: {
      // This should correspond to a unique id for the current user.
      // TODO: add User implementation once logins are used
      client_user_id: /*clientUserId*/ 'abc',
    },
    client_name: 'Arcasoy Home Site',
    products: ['auth'],
    language: 'en',
    webhook: 'https://webhook.example.com',
    country_codes: ['US'],
  };
  try {
    const createTokenResponse = await client.linkTokenCreate(req);
    res.json(createTokenResponse.data);
  } catch (err) {
    console.log(err);
  }
});

router.post('/api/exchange_public_token', async function (req, res) {
  //Exchange public token for access token
  const publicToken = req.body.publicToken;
  try {
    const res = await client.itemPublicTokenExchange({
      public_token: publicToken,
    })
    const accessToken = res.data.access_token;
    const itemID = res.data.item_id;
    console.log(accessToken, itemID);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;