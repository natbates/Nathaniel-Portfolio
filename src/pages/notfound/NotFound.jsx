import React from "react";
import { Link } from "react-router-dom";
import messages from "./notfound.messages";

export default function NotFound() {
  return (
    <section className="p-4 text-center flex flex-1 flex-col justify-center items-center">
      <h2 className="text-8xl mb-4">{messages.heading}</h2>
      <p className="mb-4">{messages.lead}</p>
        <Link to="/" className="font-medium">
        {messages.homeLink}
      </Link>
    </section>
  );
}
