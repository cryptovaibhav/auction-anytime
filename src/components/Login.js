import React from 'react';
import { login } from '../utils';

function Login(props){
    return (
      <div className="page-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <main>
          <h1>Welcome to Auction Anytime!</h1>
          <p>
            To make use of the NEAR blockchain, you need to sign in using your near testnet account. The button
            below will sign you in using NEAR Wallet.
          </p>
          <p>
            By default, when your app runs in "development" mode, it connects
            to a test network ("testnet") wallet. 
          </p>
          <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
            <button className="btn btn-lg btn-outline-primary" onClick={login}>Sign in</button>
          </p>
        </main>
      </div>
    )
}

export default Login;