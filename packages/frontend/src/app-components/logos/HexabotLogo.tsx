/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import Link from "next/link";

import { RouterType } from "@/services/types";

export const HexabotLogo = () => {
  return (
    <Link
      href={RouterType.HOME}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        textDecoration: "none",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="32"
        width="32"
        viewBox="0 0 200 200"
      >
        <defs>
          <linearGradient id="meghCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7B1FA2" />
            <stop offset="100%" stopColor="#87CEEB" />
          </linearGradient>
        </defs>
        <path
          d="M60 120 Q40 120 40 100 Q40 85 55 80 Q55 55 80 50 Q95 47 105 55 Q115 45 135 50 Q155 55 155 75 Q170 78 170 95 Q170 120 150 120 Z"
          fill="url(#meghCloudGrad)"
          stroke="#7B1FA2"
          strokeWidth="2"
        />
        <circle cx="100" cy="85" r="12" fill="white" fillOpacity="0.9" stroke="#7B1FA2" strokeWidth="1.5" />
        <circle cx="80" cy="95" r="6" fill="white" fillOpacity="0.85" stroke="#7B1FA2" strokeWidth="1" />
        <circle cx="120" cy="95" r="6" fill="white" fillOpacity="0.85" stroke="#7B1FA2" strokeWidth="1" />
        <circle cx="90" cy="108" r="4" fill="white" fillOpacity="0.8" stroke="#7B1FA2" strokeWidth="1" />
        <circle cx="110" cy="108" r="4" fill="white" fillOpacity="0.8" stroke="#7B1FA2" strokeWidth="1" />
        <line x1="90" y1="88" x2="84" y2="92" stroke="#7B1FA2" strokeWidth="1.5" />
        <line x1="110" y1="88" x2="116" y2="92" stroke="#7B1FA2" strokeWidth="1.5" />
        <line x1="85" y1="100" x2="90" y2="105" stroke="#7B1FA2" strokeWidth="1.5" />
        <line x1="115" y1="100" x2="110" y2="105" stroke="#7B1FA2" strokeWidth="1.5" />
        <line x1="94" y1="108" x2="106" y2="108" stroke="#7B1FA2" strokeWidth="1.5" />
        <line x1="100" y1="97" x2="100" y2="104" stroke="#7B1FA2" strokeWidth="1.5" />
      </svg>
      <span
        style={{
          fontSize: "18px",
          fontWeight: 700,
          background: "linear-gradient(135deg, #7B1FA2, #87CEEB)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "0.5px",
        }}
      >
        Megh EngageX
      </span>
    </Link>
  );
};
