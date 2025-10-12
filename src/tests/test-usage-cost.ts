import { strict as assert } from "assert";
import test, { suite } from "node:test";
import modelSpecs from "../../model_prices_and_context_window-gen.json" with { type: "json" };
import { estimateModelUsageCost } from "../usage-cost/index.js";

suite("usage-cost", () => {
    test("basic", () => {
        const cost = estimateModelUsageCost("gpt-4o", {
            inputTokens: 1000,
            cachedInputTokens: 800,
            outputTokens: 1000,
            totalTokens: 2000,
        });
        assert.equal(typeof cost, "number");
        assert.ok(cost !== undefined);
        assert.ok(cost > 0);

        const spec = modelSpecs["gpt-4o"];
        const expCost =
            spec.cache_read_input_token_cost * 800 +
            spec.input_cost_per_token * 200 +
            spec.output_cost_per_token * 1000;
        assert.equal(cost, expCost, "should match manual calculation");
    });
});
