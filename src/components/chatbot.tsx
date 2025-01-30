"use client";
import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    botpressWebChat?: any; // Explicitly declare botpressWebChat
  }
}

export default function Chatbot() {
  const initBotPress = () => {
    // Ensure botpressWebChat is available
    if (window.botpressWebChat) {
      console.log("Botpress WebChat initialized.");
      window.botpressWebChat.init({
        botId: "e14b2c7e-be15-43f1-a23e-ba436a712949",
      });
    } else {
      console.error("Botpress Web Chat is not available");
    }
  };

  useEffect(() => {
    // Ensure the botpress script is loaded before calling initBotPress
    const scriptLoaded = () => {
      if (window.botpressWebChat) {
        console.log("Botpress Web Chat script loaded.");
        initBotPress();
      } else {
        console.log("Waiting for Botpress Web Chat script to load...");
        setTimeout(scriptLoaded, 500); // Retry after 500ms to give time for Botpress to initialize
      }
    };

    scriptLoaded();
  }, []);

  return (
    <>
      <Script
        src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"
        strategy="afterInteractive"
        onLoad={() => console.log("Botpress script injected successfully")}
      />
    </>
  );
}
