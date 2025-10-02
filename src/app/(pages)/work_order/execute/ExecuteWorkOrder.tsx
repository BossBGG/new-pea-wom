import React, {useState} from "react";
import WorkExecution from "@/app/(pages)/work_order/(special-form)/component/work_execution/work_execution";
import AddImages from "@/app/(pages)/work_order/(special-form)/component/work_execution/add_images";
import AddFile from "@/app/(pages)/work_order/(special-form)/component/work_execution/add_file";
import Comment from "@/app/(pages)/work_order/(special-form)/component/work_execution/comment";
import SatisfactionAssessment
  from "@/app/(pages)/work_order/(special-form)/component/work_execution/satisfaction_assessment";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";
import RatingAndComment from "@/app/(pages)/work_order/(special-form)/component/work_execution/RatingAndComment ";
import SignatureSection from "@/app/(pages)/work_order/(special-form)/component/work_execution/signature_section";
import RecordKeeper from "@/app/(pages)/work_order/(special-form)/component/work_execution/record_keeper";
import {useAppSelector} from "@/app/redux/hook";

interface ExecuteWorkOrderProps {
  requestCode: string,
  isSurvey: boolean,
  renderByService: () => React.ReactNode
}

export const ExecuteWorkOrder: React.FC<ExecuteWorkOrderProps> = ({
                                                                    requestCode,
                                                                    isSurvey,
                                                                    renderByService
                                                                  }) => {
  const screenSize = useAppSelector(state => state.screen_size)
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [customerSignature, setCustomerSignature] = useState<string>("");
  const [recordKeeperSignature, setRecordKeeperSignature] = useState<string>("");

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    const words = newComment.trim().split(/\s+/);
    if (words.length <= 50) {
      setComment(newComment);
    }
  };

  const handleCustomerSignatureChange = (newSignature: string) => {
    setCustomerSignature(newSignature);
  };

  const handleRecordKeeperSignatureChange = (newSignature: string) => {
    setRecordKeeperSignature(newSignature);
  };

  return (
    <div>
      {/*ผลการปฏิบัติงาน*/}
      <WorkExecution />

      {isSurvey && renderByService()}

      {/*รูปแนบเพิ่มเติม*/}
      <AddImages />

      {/*ไฟล์แนบเพิ่มเติม*/}
      <AddFile />

      {/*หมายเหตุเพิ่มเติม*/}
      <Comment />

      {screenSize === "mobile" ? (
        <>
          {/* Mobile version - separate components with CardCollapse */}
          <CardCollapse title="ผลการประเมินความพึงพอใจของลูกค้าต่อการปฏิบัติงาน">
            <div className="p-4 -mt-6">
              <RatingAndComment
                rating={rating}
                comment={comment}
                onRatingChange={handleRatingChange}
                onCommentChange={handleCommentChange}
              />

              {/* Show word count for mobile (max 50 words) */}
              <div className="flex justify-end mt-2">
                      <span
                        className={`text-sm ${
                          comment.trim().split(/\s+/).length > 45
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {
                          comment
                            .trim()
                            .split(/\s+/)
                            .filter((word) => word.length > 0).length
                        }
                        /50 คำ
                      </span>
              </div>
            </div>
          </CardCollapse>

          <CardCollapse title="ลายเซ็นลูกค้า">
            <div className="p-4 -mt-6">
              <SignatureSection
                title="ภาพลายเซ็นลูกค้า"
                signature={customerSignature}
                onSignatureChange={handleCustomerSignatureChange}
              />
            </div>
          </CardCollapse>

          <CardCollapse title="ลายเซ็นผู้บันทึกปฏิบัติงาน">
            <div className="p-4 -mt-6">
              <SignatureSection
                title="ภาพลายเซ็นผู้บันทึกปฏิบัติงาน"
                signature={recordKeeperSignature}
                onSignatureChange={handleRecordKeeperSignatureChange}
              />
            </div>
          </CardCollapse>
        </>
      ) : (
        <>
          {/*ความพึงพอใจต่อการให้บริการ*/}
          <SatisfactionAssessment />
          {/*ผู้บันทึกผลปฏิบัติงาน*/}
          <RecordKeeper />
        </>
      )}
    </div>
  )
}
