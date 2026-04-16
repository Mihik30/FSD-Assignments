const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Product = require("../models/Product");

dotenv.config();

const products = [
  {
    name: "GPT-4.1 API",
    slug: "gpt-4-1-api",
    provider: "OpenAI",
    category: "api",
    modelFamily: "GPT-4.1",
    priceMonthly: 149,
    rating: 4.9,
    inStock: true,
    tags: ["reasoning", "coding", "multimodal", "agents"],
    badges: ["Best Seller", "Enterprise Ready"],
    image: "/images/openai.png",
    description: "High-accuracy flagship API for complex reasoning, coding workflows, and agentic apps.",
    highlights: [
      "Strong code generation and debugging quality",
      "Great for production copilots and assistants",
      "Reliable latency for enterprise traffic"
    ],
    releasePeriod: "2025",
    contextWindow: "Up to 1M tokens (selected tiers)",
    modalities: ["Text", "Image", "Code"],
    bestFor: ["Engineering copilots", "Agent workflows", "Complex QA"],
    latencyTier: "Medium",
    deploymentType: "Hosted API",
    pricingNote: "Usage-based token pricing. Monthly estimate depends on volume.",
    featured: true
  },
  {
    name: "o3 Reasoning API",
    slug: "o3-reasoning-api",
    provider: "OpenAI",
    category: "api",
    modelFamily: "o3",
    priceMonthly: 189,
    rating: 4.9,
    inStock: true,
    tags: ["deep reasoning", "math", "analysis"],
    badges: ["Advanced Reasoning", "Top Rated"],
    image: "/images/openai.png",
    description: "Reasoning-focused model for high-stakes tasks including planning, analysis, and technical problem solving.",
    highlights: [
      "Excellent chain-of-thought quality on difficult tasks",
      "Strong performance on analytics and planning",
      "Ideal for research and decision support systems"
    ],
    releasePeriod: "2025",
    contextWindow: "Large context, optimized for deep reasoning",
    modalities: ["Text", "Code"],
    bestFor: ["Math-heavy tasks", "Strategy planning", "Technical analysis"],
    latencyTier: "Medium to High",
    deploymentType: "Hosted API",
    pricingNote: "Higher cost tier designed for difficult reasoning workloads.",
    featured: true
  },
  {
    name: "Claude 3.7 Sonnet",
    slug: "claude-3-7-sonnet",
    provider: "Anthropic",
    category: "api",
    modelFamily: "Claude 3",
    priceMonthly: 139,
    rating: 4.8,
    inStock: true,
    tags: ["long context", "writing", "analysis"],
    badges: ["Long Context", "Popular"],
    image: "/images/Anthropic_logo.svg",
    description: "Balanced and reliable API model for long-document workflows, product copy, and enterprise assistants.",
    highlights: [
      "High quality for structured writing and drafting",
      "Performs well on document-heavy tasks",
      "Strong safety and compliance posture"
    ],
    releasePeriod: "2025",
    contextWindow: "Up to 200K tokens",
    modalities: ["Text", "Image", "Code"],
    bestFor: ["Long-document analysis", "Policy drafting", "Enterprise assistants"],
    latencyTier: "Medium",
    deploymentType: "Hosted API",
    pricingNote: "Token-based billing with strong value on long-context tasks.",
    featured: true
  },
  {
    name: "Gemini 2.5 Pro",
    slug: "gemini-2-5-pro",
    provider: "Google",
    category: "api",
    modelFamily: "Gemini 2.5",
    priceMonthly: 129,
    rating: 4.8,
    inStock: true,
    tags: ["multimodal", "video", "reasoning"],
    badges: ["Multimodal", "New"],
    image: "/images/gemini.png",
    description: "Latest multimodal model for text, image, and rich media understanding with robust reasoning.",
    highlights: [
      "Strong cross-modal retrieval and summarization",
      "Great for search, support, and knowledge bots",
      "Reliable quality in mixed media prompts"
    ],
    releasePeriod: "2025",
    contextWindow: "Up to 1M tokens (provider configuration)",
    modalities: ["Text", "Image", "Audio", "Video"],
    bestFor: ["Multimodal search", "Support automation", "Media understanding"],
    latencyTier: "Medium",
    deploymentType: "Hosted API",
    pricingNote: "Usage-based rates vary by modality and input size.",
    featured: true
  },
  {
    name: "Grok 3",
    slug: "grok-3",
    provider: "xAI",
    category: "api",
    modelFamily: "Grok",
    priceMonthly: 119,
    rating: 4.6,
    inStock: true,
    tags: ["real-time", "assistant", "research"],
    badges: ["Realtime Insights"],
    image: "/images/Grok.png",
    description: "Conversational API model optimized for fast interactions and continuously refreshed information tasks.",
    highlights: [
      "Low-latency responses for interactive products",
      "Great fit for live assistant experiences",
      "Simple API integration for teams"
    ],
    releasePeriod: "2025",
    contextWindow: "Large context for conversational workflows",
    modalities: ["Text", "Code"],
    bestFor: ["Interactive assistants", "Rapid responses", "General research"],
    latencyTier: "Low to Medium",
    deploymentType: "Hosted API",
    pricingNote: "Tier-based access model with usage-linked cost.",
    featured: false
  },
  {
    name: "Llama 4 Maverick Local Pack",
    slug: "llama-4-maverick-local-pack",
    provider: "Meta",
    category: "local",
    modelFamily: "Llama 4",
    priceMonthly: 79,
    rating: 4.7,
    inStock: true,
    tags: ["open source", "on-prem", "privacy"],
    badges: ["On-Prem", "Cost Efficient"],
    image: "/images/Meta-Logo.png",
    description: "Self-hosted deployment pack for Llama-based assistants with private data controls and infra templates.",
    highlights: [
      "Complete Docker and inference templates included",
      "Designed for private and regulated workloads",
      "Predictable monthly infrastructure estimate"
    ],
    releasePeriod: "2025",
    contextWindow: "Long-context variant options",
    modalities: ["Text", "Image"],
    bestFor: ["On-prem assistants", "Private data workloads", "Cost-sensitive scaling"],
    latencyTier: "Depends on hardware",
    deploymentType: "Self-hosted",
    pricingNote: "Model weights are open; monthly estimate covers infrastructure and operations.",
    featured: true
  },
  {
    name: "Mistral Large 2 API",
    slug: "mistral-large-2-api",
    provider: "Mistral",
    category: "api",
    modelFamily: "Mistral Large",
    priceMonthly: 109,
    rating: 4.6,
    inStock: true,
    tags: ["latency", "europe", "enterprise"],
    badges: ["Fast", "EU Friendly"],
    image: "/images/mistral.png",
    description: "Fast enterprise API model for multilingual support, customer operations, and internal automation.",
    highlights: [
      "Strong multilingual quality",
      "Low response latency for app UX",
      "Well-suited for support automation"
    ],
    releasePeriod: "2024-2025",
    contextWindow: "Enterprise long-context support",
    modalities: ["Text", "Code"],
    bestFor: ["Multilingual support", "Ops automation", "Internal copilots"],
    latencyTier: "Low",
    deploymentType: "Hosted API",
    pricingNote: "Competitive API pricing with strong latency-performance balance.",
    featured: false
  },
  {
    name: "Qwen2.5 72B Inference Stack",
    slug: "qwen-2-5-72b-inference-stack",
    provider: "Alibaba Cloud",
    category: "local",
    modelFamily: "Qwen2.5",
    priceMonthly: 69,
    rating: 4.5,
    inStock: true,
    tags: ["open source", "multilingual", "self-hosted"],
    badges: ["Value Pick"],
    image: "/images/qwen.jpeg",
    description: "Local deployment stack for capable multilingual assistants with practical infra presets.",
    highlights: [
      "Optimized setup for budget-conscious teams",
      "Useful baseline for private copilots",
      "Includes deployment and monitoring scripts"
    ],
    releasePeriod: "2024-2025",
    contextWindow: "Extended-context configuration available",
    modalities: ["Text", "Code"],
    bestFor: ["Multilingual copilots", "Private deployment", "Budget-first teams"],
    latencyTier: "Depends on hardware",
    deploymentType: "Self-hosted",
    pricingNote: "Open-model economics; monthly estimate reflects GPUs and maintenance.",
    featured: false
  },
  {
    name: "DeepSeek V3 API",
    slug: "deepseek-v3-api",
    provider: "DeepSeek",
    category: "api",
    modelFamily: "DeepSeek",
    priceMonthly: 89,
    rating: 4.5,
    inStock: true,
    tags: ["coding", "reasoning", "budget"],
    badges: ["Budget Friendly"],
    image: "/images/deepseek.png",
    description: "Affordable API model balancing coding capability and general reasoning for startup use cases.",
    highlights: [
      "Strong coding value for cost",
      "Practical for MVP assistants",
      "Simple onboarding for small teams"
    ],
    releasePeriod: "2024-2025",
    contextWindow: "Large context for coding and analysis",
    modalities: ["Text", "Code"],
    bestFor: ["Coding assistants", "MVP automation", "Cost-optimized apps"],
    latencyTier: "Medium",
    deploymentType: "Hosted API",
    pricingNote: "Budget-friendly token rates targeted at startup workloads.",
    featured: false
  },
  {
    name: "Command R+ Retrieval API",
    slug: "command-r-plus-retrieval-api",
    provider: "Cohere",
    category: "api",
    modelFamily: "Command",
    priceMonthly: 99,
    rating: 4.6,
    inStock: true,
    tags: ["rag", "enterprise search", "knowledge"],
    badges: ["RAG Optimized"],
    image: "/images/cohere.png",
    description: "Retrieval-first model package for enterprise search, policy assistants, and internal knowledge bases.",
    highlights: [
      "Designed for grounded RAG responses",
      "Solid performance on enterprise docs",
      "Low hallucination setup guidance included"
    ],
    releasePeriod: "2024-2025",
    contextWindow: "Long-context enterprise retrieval tuning",
    modalities: ["Text", "Code"],
    bestFor: ["RAG pipelines", "Knowledge search", "Compliance assistants"],
    latencyTier: "Medium",
    deploymentType: "Hosted API",
    pricingNote: "Optimized for retrieval use-cases with predictable enterprise usage tiers.",
    featured: false
  }
];

async function seedProducts() {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Product seed completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Product seed failed:", error.message);
    process.exit(1);
  }
}

seedProducts();
