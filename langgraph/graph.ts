import { StateGraph, START, END } from "@langchain/langgraph";
import { GraphStateAnnotation } from "./state";
import { planningNode } from "../nodes/planning";
import { companyNode } from "../nodes/company";
import { financialNode } from "../nodes/financial";
import { newsNode } from "../nodes/news";
import { marketNode } from "../nodes/market";
import { evidenceNode } from "../nodes/evidence";
import { reasoningNode } from "../nodes/reasoning";
import { formatterNode } from "../nodes/formatter";

// Define the StateGraph using the GraphStateAnnotation schema
const builder = new StateGraph(GraphStateAnnotation)
  .addNode("planning", planningNode)
  .addNode("companyResearch", companyNode)
  .addNode("financialAnalysis", financialNode)
  .addNode("newsAnalysis", newsNode)
  .addNode("marketAssessment", marketNode)
  .addNode("evidenceAggregation", evidenceNode)
  .addNode("investmentReasoning", reasoningNode)
  .addNode("reportFormatter", formatterNode);

// Wire the workflow execution path
builder.addEdge(START, "planning");

// Transition from planning to parallel research nodes
builder.addEdge("planning", "companyResearch");
builder.addEdge("planning", "financialAnalysis");
builder.addEdge("planning", "newsAnalysis");

// Join the parallel research paths at the market analysis node
builder.addEdge("companyResearch", "marketAssessment");
builder.addEdge("financialAnalysis", "marketAssessment");
builder.addEdge("newsAnalysis", "marketAssessment");

// Proceed sequentially through reasoning and report formatting
builder.addEdge("marketAssessment", "evidenceAggregation");

builder.addEdge("evidenceAggregation", "investmentReasoning");
builder.addEdge("investmentReasoning", "reportFormatter");
builder.addEdge("reportFormatter", END);


// Compile the executable StateGraph
export const graph = builder.compile();
