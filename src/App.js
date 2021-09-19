import 'regenerator-runtime/runtime';
import React from 'react';
import Login from "./components/Login";
import Main from './components/Main';

export default function App() {
  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (<Login />)
  }
  return (
      <Main />
  )
}
