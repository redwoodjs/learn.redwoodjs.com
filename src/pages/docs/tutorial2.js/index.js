import React from 'react';
import { Redirect } from '@docusaurus/router';

function Tutorial2() {
  // Must use relative path to allow dynamic routing in various locales
  return <Redirect to="./welcome-to-redwood-part-ii-redwoods-revenge" />;
}

export default Tutorial2;
