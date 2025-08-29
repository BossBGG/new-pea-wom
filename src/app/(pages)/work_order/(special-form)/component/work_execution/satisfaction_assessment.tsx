import React, { useState } from "react";
import CardCollapse from "../CardCollapse";


import SignatureSection from "./signature_section";
import RatingAndComment from "./RatingAndComment ";


interface SatisfactionData {
  rating: number;
  comment: string;
  signature: string;
}

interface SatisfactionAssessmentProps {
  onDataChange?: (data: SatisfactionData) => void;
}

const SatisfactionAssessment: React.FC<SatisfactionAssessmentProps> = ({
  onDataChange,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [signature, setSignature] = useState<string>("");

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    updateData(newRating, comment, signature);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
    updateData(rating, newComment, signature);
  };

  const handleSignatureChange = (newSignature: string) => {
    setSignature(newSignature);
    updateData(rating, comment, newSignature);
  };

  const updateData = (
    newRating: number,
    newComment: string,
    newSignature: string
  ) => {
    onDataChange?.({
      rating: newRating,
      comment: newComment,
      signature: newSignature,
    });
  };

  

  return (
    <CardCollapse title="ผลการประเมินความพึงพอใจของลูกค้าต่อการปฏิบัติงาน">
      <div className="p-4 space-y-6">
        {/* Main Layout with flex-row */}
        <div className="flex flex-row gap-4 justify-between">
          {/* Left side - Rating and Comment */}
          <div className="lg:w-[54%]">
          <RatingAndComment
            rating={rating}
            comment={comment}
            onRatingChange={handleRatingChange}
            onCommentChange={handleCommentChange}
          />
          </div>
          {/* Right side - Signature Section */}
          
          <SignatureSection
            title="ภาพลายเซ็นลูกค้า"
            signature={signature}
            onSignatureChange={handleSignatureChange}
            showPresetSignature={false}
            showResetButton={true}
          />
          
        </div>

        
      </div>
    </CardCollapse>
  );
};

export default SatisfactionAssessment;