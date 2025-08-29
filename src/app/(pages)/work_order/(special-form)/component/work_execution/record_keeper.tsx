import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CardCollapse from '../CardCollapse';
import SignatureSection from './signature_section';


interface RecordKeeperData {
  employeeId: string;
  name: string;
  phoneNumber: string;
  signature: string;
}

interface RecordKeeperProps {
  onDataChange?: (data: RecordKeeperData) => void;
}

const RecordKeeper: React.FC<RecordKeeperProps> = ({ onDataChange }) => {
  const [employeeId, setEmployeeId] = useState<string>('356579 - นาย มงคล ธรรมปัญโน');
  const [status, setStatus] = useState<string>('คช 8');
  const [phoneNumber, setPhoneNumber] = useState<string>('098 - 84950689');
  const [signature, setSignature] = useState<string>('');

  const updateData = (newEmployeeId: string, newName: string, newPhoneNumber: string, newSignature: string) => {
    onDataChange?.({
      employeeId: newEmployeeId,
      name: newName,
      phoneNumber: newPhoneNumber,
      signature: newSignature
    });
  };

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEmployeeId(newValue);
    updateData(newValue, status, phoneNumber, signature);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setStatus(newValue);
    updateData(employeeId, newValue, phoneNumber, signature);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhoneNumber(newValue);
    updateData(employeeId, status, newValue, signature);
  };

  const handleSignatureChange = (newSignature: string) => {
    setSignature(newSignature);
    updateData(employeeId, status, phoneNumber, newSignature);
  };

  return (
    <CardCollapse title="ผู้บันทึกปฏิบัติงาน">
      <div className="p-4">
        <div className="flex flex-row gap-6">
          <div className="flex flex-col flex-1 space-y-4">
            {/* Employee ID */}
            <div>
              <Label htmlFor="employee-id" className="text-sm font-medium text-gray-700 mb-2 block">
                รหัสผู้บันทึกผลปฏิบัติงาน :
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="employee-id"
                  value={employeeId}
                  onChange={handleEmployeeIdChange}
                  placeholder="รหัสผู้บันทึกผลปฏิบัติงาน"
                  className="flex-1 h-[44px] border-[#D1D5DB]"
                />
              </div>
            </div>

            {/* Employee Name */}
            <div>
              <Label htmlFor="employee-name" className="text-sm font-medium text-gray-700 mb-2 block">
                ตำแหน่งผู้บันทึกผลปฏิบัติงาน :
              </Label>
              <Input
                id="employee-name"
                value={status}
                onChange={handleNameChange}
                placeholder="ชื่อ-นามสกุล"
                className="h-[44px] border-[#D1D5DB]"
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
          />
        </div>
      </div>
    </CardCollapse>
  );
};

export default RecordKeeper;