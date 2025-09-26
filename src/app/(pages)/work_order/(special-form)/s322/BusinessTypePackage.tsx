import React, {useEffect, useState} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import PackageDetail from "./PackageDetail";
import {Selection} from "@/app/components/form/Selection";
import BusinessType from "@/app/(pages)/work_order/(special-form)/component/work_execution/business_type";
import {Card} from "@/components/ui/card";
import {BusinessTypeObj, Options, RequestServiceDetail, WorkOrderObj} from "@/types";

interface BusinessTypePackageProps {
  updateData?: (d: WorkOrderObj) => void;
  data: WorkOrderObj;
  currentStep?: number;
  survey?: boolean;
  businessTypeOptions: Options[]
  onUpdateBusinessTypeOptions?: (opts: Options[]) => void;
}

// S322 Business Type Package Component
const BusinessTypePackage: React.FC<BusinessTypePackageProps> = ({
                                                                   updateData,
                                                                   data,
                                                                   currentStep = 0,
                                                                   survey = false,
                                                                   businessTypeOptions,
                                                                   onUpdateBusinessTypeOptions
                                                                 }) => {
  const [businessType, setBusinessType] = useState<string>();
  const [packageId, setPackage] = useState<string>();
  const [showPackageDetail, setShowPackageDetail] = useState(false);

  useEffect(() => {
    if(typeof data.requestServiceDetail === 'object') {
      setBusinessType(data.requestServiceDetail?.business_type_id || "")
      setPackage(data.requestServiceDetail?.package_id || "");
    }
  }, [data.requestServiceDetail]);

  const packageOptions = [
    {
      value: "package1",
      label: "Package 1 - ระบบไฟฟ้าแบบครบวงจร (35,000 บาท)",
    },
    {
      value: "package2",
      label: "Package 2 - ระบบไฟฟ้าแบบมาตรฐาน (25,000 บาท)",
    },
    {
      value: "package3",
      label: "Package 3 - ระบบไฟฟ้าแบบพื้นฐาน (20,000 บาท)",
    },
    {
      value: "package4",
      label: "Package 4 - ระบบไฟฟ้าแบบเบื้องต้น (10,000 บาท)",
    },
  ];

  const handleUpdateBusiness = (item: BusinessTypeObj) => {
    setBusinessType(item.id)
    handleUpdateData('business_type_id', item.id)
  };

  const handlePackageSelect = (packageId: string) => {
    setPackage(packageId);
    handleUpdateData('package_id', packageId)
  };

  const handleUpdateData = (key: string, value: string) => {
    let newData = data;
    newData = {
      ...newData,
      requestServiceDetail: {
        ...newData.requestServiceDetail as RequestServiceDetail,
        [key]: value
      }
    }
    updateData?.(newData)
  }

  /*const renderStepContent = () => {
    console.log('currentStep >>> ', currentStep)
    switch (currentStep) {
      case 0:
      case 1:
      case 2:
        // Steps 0, 1, 2 - Show business type selector
        return (
          <div className=" bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
            <div className="space-y-2 flex flex-row ">
              <div className="w-full mr-2">
                <Label
                  htmlFor="business-type"
                  className="text-sm font-medium text-gray-700"
                >
                  ประเภทธุรกิจ
                </Label>
                <Select value={selectedValue} onValueChange={handleValueChange}>
                  <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                    <SelectValue placeholder="เลือกประเภทธุรกิจ" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <div className="flex items-center justify-between mb-3">
                  <Label
                    htmlFor="package"
                    className="font-[16px]"
                  >
                    Package
                  </Label>
                  <button
                    onClick={() => setShowPackageDetail(true)}
                    className="text-purple-600 hover:text-purple-800 underline"
                  >
                    รายละเอียด Package
                  </button>
                </div>
                <Select value={selectedValue} onValueChange={handleValueChange}>
                  <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                    <SelectValue placeholder="เลือกแพ็กเกจบริการ"/>
                  </SelectTrigger>
                  <SelectContent>
                    {packageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        // Step 3 - Show package selector with detail link
        if (survey) {
          // survey = true: แสดง business type selector
          return (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
              <div className="space-y-2 flex flex-row">
                <div className="w-full mr-2">
                  <Label
                    htmlFor="business-type"
                    className="text-sm font-medium text-gray-700"
                  >
                    ประเภทธุรกิจ
                  </Label>
                  <Select value={selectedValue} onValueChange={handleValueChange}>
                    <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                      <SelectValue placeholder="เลือกประเภทธุรกิจ"/>
                    </SelectTrigger>
                    <SelectContent>
                      {businessOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="package"
                      className="text-sm font-medium text-gray-700"
                    >
                      Package
                    </Label>
                    <button
                      onClick={() => setShowPackageDetail(true)}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium underline"
                    >
                      รายละเอียด Package
                    </button>
                  </div>
                  <Select value={selectedValue} onValueChange={handleValueChange}>
                    <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                      <SelectValue placeholder="เลือกแพ็กเกจบริการ"/>
                    </SelectTrigger>
                    <SelectContent>
                      {packageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          );
        } else {
          // survey = false: แสดง package selector with detail link
          return (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
              <div className="space-y-4">
                {/!* Package Selection *!/}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="package"
                      className="text-sm font-medium text-gray-700"
                    >
                      Package
                    </Label>
                    <button
                      onClick={() => setShowPackageDetail(true)}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium underline"
                    >
                      รายละเอียด Package
                    </button>
                  </div>
                  <Select value={selectedValue} onValueChange={handleValueChange}>
                    <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                      <SelectValue placeholder="เลือกแพ็กเกจบริการ"/>
                    </SelectTrigger>
                    <SelectContent>
                      {packageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/!* Selected Package Info *!/}
                {selectedValue &&
                  packageOptions.find((opt) => opt.value === selectedValue) && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-green-800 font-medium">
                          แพ็กเกจที่เลือก:{" "}
                          {
                            packageOptions.find(
                              (opt) => opt.value === selectedValue
                            )?.label
                          }
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          );
        }

      default:
        return null;
    }
  };*/

  return (
    <Card className="px-2 py-4">
      {/*{renderStepContent()}*/}
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 px-2 mb-3 md:mb-0">
          <BusinessType value={businessType as string}
                        businessOptions={businessTypeOptions}
                        onUpdateOptions={onUpdateBusinessTypeOptions}
                        onChange={handleUpdateBusiness}
          />
        </div>

        <div className="w-full md:w-1/2 px-2">
          <div className="flex justify-between items-center mb-2">
            <Label
              htmlFor="business-type"
              className="font-medium text-[16px]"
            >
              เลือกแพ็กเกจบริการ
            </Label>

            <button
              onClick={() => setShowPackageDetail(true)}
              className="text-purple-600 hover:text-purple-800 underline cursor-pointer"
            >
              รายละเอียด Package
            </button>
          </div>

          <Selection value={packageId as string}
                     options={packageOptions}
                     placeholder={"เลือกแพ็กเกจบริการ"}
                     onUpdate={handlePackageSelect}
          />
        </div>
      </div>

      <PackageDetail
        isOpen={showPackageDetail}
        onClose={() => setShowPackageDetail(false)}
      />
    </Card>
  );
};

export default BusinessTypePackage;
