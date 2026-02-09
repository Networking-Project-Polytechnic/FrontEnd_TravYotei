
"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Traveler Basic",
    price: "Free",
    description: "Essential features for occasional travelers.",
    features: [
      "Search and book trips",
      "Real-time bus tracking",
      "Basic support",
      "Mobile app access",
    ],
    notIncluded: ["Priority booking", "No booking fees", "Premium lounge access"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Traveler Premium",
    price: "2,000 FCFA",
    period: "/month",
    description: "For frequent travelers who want comfort and perks.",
    features: [
      "All Basic features",
      "Zero booking fees",
      "Priority seat selection",
      "24/7 Premium support",
      "Exclusive discounts",
    ],
    notIncluded: ["Premium lounge access"],
    cta: "Upgrade Now",
    popular: true,
  },
  {
    name: "Agency Partner",
    price: "Custom",
    description: "Complete solution for transport agencies.",
    features: [
      "Fleet management dashboard",
      "Route optimization",
      "Revenue analytics",
      "Driver app integration",
      "Marketing tools",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base font-semibold tracking-wide text-cyan-600 uppercase"
          >
            Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Plans for everyone
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-400 mx-auto"
          >
            Choose the plan that best fits your travel needs or business goals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
              className={`relative p-8 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm flex flex-col ${
                plan.popular
                  ? "border-cyan-500 ring-2 ring-cyan-500 ring-opacity-50"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -mr-1 -mt-1 w-32 h-32 overflow-hidden rounded-tr-2xl">
                  <div className="absolute top-0 right-0 py-1 px-4 text-center bg-cyan-500 text-white text-xs font-bold transform translate-x-10 translate-y-6 rotate-45 w-32 shadow-md">
                    POPULAR
                  </div>
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
                  {plan.description}
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-base font-medium text-slate-500 dark:text-slate-400">
                    {plan.period}
                  </span>
                )}
              </div>
              <ul className="mb-8 space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                    <span className="text-slate-600 dark:text-slate-300 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start opacity-50">
                    <X className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
                    <span className="text-slate-500 dark:text-slate-500 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full py-6 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:scale-105"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
