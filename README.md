# ai-model-usage-cost

<a href="https://github.com/dbo/ai-model-usage-cost/actions">![CI](https://github.com/dbo/ai-model-usage-cost/actions/workflows/ci.yml/badge.svg)</a>
<a href="https://www.npmjs.com/package/ai-model-usage-cost">![NPM Version](https://img.shields.io/npm/v/ai-model-usage-cost)</a>

A cost estimation based on the usage reported by [AI SDK](https://github.com/vercel/ai) for various large language models.
**This backed by data from [Lite LLM](https://github.com/BerriAI/litellm).**

## Installation

Use it alongside the AI SDK, e.g.

```bash
$ npm install ai-model-usage-cost
```

Update [LiteLLM data](https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json)
from github running

```bash
$ npx ai-model-usage-cost update-litellm-data
```

## Usage

Use with response from AI SDK, e.g.

```typescript
const { usage, ... } = await generateObject({
    model,
    ...
});
const cost = estimateModelUsageCost(model, usage);
```
