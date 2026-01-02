import type { LanguageModel, LanguageModelUsage } from "ai";
import modelSpecs from "../../model_prices_and_context_window.json" with { type: "json" };

/**
 * @see https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json
 */
type LiteLLMModelSpec = {
    input_cost_per_token: number; // in US dollars

    /**
     * Standard rate for openai models
     */
    cache_read_input_token_cost?: number; // in US dollars
    // cache_read_input_token_cost_flex?: number; // in US dollars
    // cache_read_input_token_cost_priority?: number; // in US dollars

    /**
     * Standard rate for openai models
     */
    output_cost_per_token: number; // in US dollars
    // output_cost_per_token_flex?: number; // in US dollars
    // output_cost_per_token_priority?: number; // in US dollars

    output_cost_per_reasoning_token?: number; // in US dollars,

    tiered_pricing?: (LiteLLMModelSpec & {
        range: [number, number]; // inclusive range of context window size in tokens
    })[];
};

/**
 * Estimates the cost of a language model usage.
 * The calculation is based on model specs provided by LiteLLM.
 *
 * @attention This is an estimate only, actual costs may vary, no warranty!
 */
export function estimateModelUsageCost(
    model: LanguageModel,
    usage: LanguageModelUsage,
): number | undefined {
    const { inputTokens, outputTokens, inputTokenDetails, outputTokenDetails } = usage;
    if (inputTokens === undefined || outputTokens === undefined) {
        console.warn("No token usage: %o", usage);
        return;
    }
    const reasoningTokens = outputTokenDetails?.reasoningTokens ?? usage.reasoningTokens ?? 0;
    const cacheReadTokens = inputTokenDetails?.cacheReadTokens ?? usage.cachedInputTokens ?? 0;

    const modelId = typeof model === "string" ? model : model.modelId;

    let spec = ((modelSpecs as any)[modelId] || {}) as LiteLLMModelSpec;
    if (spec.tiered_pricing) {
        spec = {
            ...spec,
            ...spec.tiered_pricing.find(
                (p) => p.range[0] <= inputTokens && inputTokens <= p.range[1],
            ),
        };
    }

    const {
        input_cost_per_token,
        output_cost_per_token,
        cache_read_input_token_cost = 0,
        output_cost_per_reasoning_token = 0,
    } = spec;
    if (!input_cost_per_token || !output_cost_per_token) {
        console.warn("Cannot calculate model usage cost for %s: %o", modelId, spec);
        return;
    }

    const cost =
        (outputTokens - reasoningTokens) * output_cost_per_token +
        reasoningTokens * output_cost_per_reasoning_token +
        (inputTokens - cacheReadTokens) * input_cost_per_token +
        cacheReadTokens * cache_read_input_token_cost;

    return cost;
}
