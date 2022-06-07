import React, { useCallback, useState } from 'react';

import { usePlaidLink } from 'react-plaid-link';

const SimplePlaidLink = () => {
  const [token, setToken] = useState(null);

  // get link_token from your server when component mounts
  React.useEffect(() => {
    const createLinkToken = async () => {
      const response = await fetch('http://localhost:9000/plaid/api/create_link_token', { method: 'POST' });
      const { link_token } = await response.json();
      setToken(link_token);
    };
    createLinkToken();
  }, []);

  const onSuccess = useCallback(async (publicToken, metadata) => {
    // send public_token to the server
    // https://plaid.com/docs/api/tokens/#token-exchange-flow
    // console.log(publicToken, metadata);
    fetch('http://localhost:9000/plaid/api/exchange_public_token', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicToken }),
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  // const onEvent callback goes here

  // const onExit callback goes here

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
    // onEvent
    // onExit
  });

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
};

export default SimplePlaidLink;