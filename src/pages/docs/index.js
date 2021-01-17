import React from "react";
import { Redirect } from "@docusaurus/router";

function Docs() {
	// Must use relative path to allow dynamic routing in various locales
	return <Redirect to="./tutorial/welcome-to-redwood" />;
}

export default Docs;
