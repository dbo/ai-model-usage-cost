#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const resp = await fetch(
    "https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json",
    {
        redirect: "follow",
    },
);
const data = await resp.json();
writeFileSync(
    join(import.meta.dirname, "..", "..", "model_prices_and_context_window.json"),
    JSON.stringify(data, null, 2),
);

console.log("Updated model_prices_and_context_window.json");
