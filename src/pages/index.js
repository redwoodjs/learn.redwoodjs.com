import React from 'react';
import { Redirect } from '@docusaurus/router';

function Home() {
	// Must use relative path to allow dynamic routing in various locales
	return <Redirect to="./docs/tutorial/welcome-to-redwood" />;
}

export default Home;
