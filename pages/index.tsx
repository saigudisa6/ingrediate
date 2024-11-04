import React from "react";
import HomePage from "./home";
import { useUser } from "@auth0/nextjs-auth0/client";

function index() {
  return <HomePage/>
}

export default index;