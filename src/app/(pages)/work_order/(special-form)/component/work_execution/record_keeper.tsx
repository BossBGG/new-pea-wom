import React, {useState} from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import CardCollapse from '../CardCollapse';
import SignatureSection from './signature_section';
import {WorkOrderObj} from "@/types";

interface RecordKeeperOptions {
  isReadOnly?: boolean;
  initialCustomerSignature?: string;
  initialRecordKeeperSignature?: string;
}

interface RecordKeeperProps {
  data: WorkOrderObj,
  setData: (d: WorkOrderObj) => void,
  options?: RecordKeeperOptions;
}

const RecordKeeper: React.FC<RecordKeeperProps> = ({
                                                     data,
                                                     setData,
                                                     options = {}
                                                   }) => {
  const {
    isReadOnly = false,
    initialRecordKeeperSignature,
  } = options;
  const [recorderName, setRecorderName] = useState<string>(data?.execution?.recorderName || "");
  const [recorderPosition, setRecorderPositionName] = useState<string>(data?.execution?.recorderPosition || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(data?.execution?.recorderPhoneNumber || "");
  const [signature, setSignature] = useState<string>(initialRecordKeeperSignature || "");

  const updateData = (key: keyof WorkOrderObj, value: string | number) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleRecorderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;

    const newValue = e.target.value;
    setRecorderName(newValue);
    updateData('recorderName', newValue)
  };

  const handleRecorderPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;

    const newValue = e.target.value;
    setRecorderPositionName(newValue);
    updateData('recorderPosition', newValue)
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;

    const newValue = e.target.value;
    setPhoneNumber(newValue);
    updateData('recorderPhoneNumber', newValue)
  };

  const handleSignatureChange = (newSignature: string) => {
    if (!isReadOnly) {
      setSignature(newSignature);
      updateData('recorderSignatureBase64', newSignature)
    }
  };


  return (
    <CardCollapse title="ผู้บันทึกปฏิบัติงาน">
      <div className="p-4 -mt-5">
        <div className="flex flex-row gap-6">
          <div className="flex flex-col flex-1 space-y-4">
            <div>
              <Label htmlFor="recorder-name" className="text-sm font-medium text-gray-700 mb-2 block">
                ชื่อผู้บันทึกผลปฏิบัติงาน : :
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="recorder-name"
                  value={recorderName}
                  onChange={handleRecorderNameChange}
                  placeholder="ชื่อผู้บันทึกผลปฏิบัติงาน :"
                  className="flex-1 h-[44px] border-[#D1D5DB]"
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            {/* Employee Name */}
            <div>
              <Label htmlFor="employee-name" className="text-sm font-medium text-gray-700 mb-2 block">
                ตำแหน่งผู้บันทึกผลปฏิบัติงาน :
              </Label>
              <Input
                id="recorder-position"
                value={recorderPosition}
                onChange={handleRecorderPositionChange}
                placeholder="ตำแหน่งผู้บันทึกผลปฏิบัติงาน"
                className="h-[44px] border-[#D1D5DB]"
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phone-number" className="text-sm font-medium text-gray-700 mb-2 block">
                เบอร์โทรผู้บันทึกผลปฏิบัติงาน :
              </Label>
              <Input
                id="phone-number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="หมายเลขโทรศัพท์"
                className="h-[44px] border-[#D1D5DB]"
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* Right side - Signature Section */}
          <SignatureSection
            title="ภาพลายเซ็นผู้บันทึกผลปฏิบัติงาน"
            signature={signature}
            onSignatureChange={handleSignatureChange}
            showPresetSignature={false}
            showResetButton={true}
            isReadOnly={isReadOnly}
          />
        </div>
      </div>
    </CardCollapse>
  );
};

export default RecordKeeper;
