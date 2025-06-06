"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { ArrowRight, User, Users } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const WelcomePage: React.FC = () => {
  const { goToNextStep } = useWizardForm();
  const router = useRouter();

  const handleGetStarted = () => {
    goToNextStep();
    router.push("/private-sessions/sign-in");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-primary-500">
          Train With Aaron
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience personalized yoga instruction designed to meet your unique
          needs and goals. Whether you&apos;re a beginner or advanced
          practitioner, Aaron will guide you on your journey.
        </p>

        <Button
          color="primary"
          size="lg"
          onPress={handleGetStarted}
          className="text-lg px-8 py-6 group"
          endContent={
            <ArrowRight
              size={20}
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            />
          }
        >
          Get Started
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center mb-4">
            <User className="w-8 h-8 text-primary-500 mr-3" />
            <h3 className="text-xl font-semibold">Individual Sessions</h3>
          </div>
          <p className="text-gray-600 mb-4">
            One-on-one personalized instruction tailored specifically to your
            needs, goals, and skill level.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Personalized programming</li>
            <li>✓ Virtual or in-person options</li>
            <li>✓ Breathwork and meditation</li>
            <li>✓ Ongoing support and guidance</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-primary-500 mr-3" />
            <h3 className="text-xl font-semibold">Group Sessions</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Share the experience with friends, family, or colleagues in a
            supportive group environment.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Custom group programming</li>
            <li>✓ Team building and connection</li>
            <li>✓ Shared learning experience</li>
            <li>✓ Special group rates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
