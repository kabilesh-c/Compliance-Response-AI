"use client";

import { useEffect, useState } from "react";
import AIFeatureModal from "./AIFeatureModal";

export default function DashboardAIModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if user has seen the AI modal before
    const hasSeenModal = localStorage.getItem("hasSeenAIModal");
    
    if (!hasSeenModal) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
    // Mark as seen so it doesn't show again
    localStorage.setItem("hasSeenAIModal", "true");
  };

  return (
    <AIFeatureModal 
      isOpen={showModal} 
      onClose={handleClose}
    />
  );
}
