import React from "react";
import { Redirect } from "@docusaurus/router";

function Tutorial() {
	// Must use relative path to allow dynamic routing in various locales
	return <Redirect to="./welcome-to-redwood" />;
}

export default Tutorial;
