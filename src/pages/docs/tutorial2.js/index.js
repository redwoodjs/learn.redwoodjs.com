import React from 'react';
import { Redirect } from '@docusaurus/router';

function Tutorial2() {
  console.log('you hit tutorial 2 component');
  // Must use relative path to allow dynamic routing in various locales
  return <Redirect to="./welcome-to-redwood-part-ii-redwoods-revenge" />;
}

export default Tutorial2;
