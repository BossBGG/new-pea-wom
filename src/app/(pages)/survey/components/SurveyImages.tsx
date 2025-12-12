import React, {useEffect, useState} from "react";
import ImageUploadCard from "@/app/components/form/UploadImage";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";
import {Survey} from "@/types";
import {uploadWorkOrderSurveyImage} from "@/app/api/WorkOrderSurveyApi";
import {showError} from "@/app/helpers/Alert";

type surveyImageProps = {
  data: Survey,
  updateData: (d: Survey) => void
}

interface ImageState {
  file: File | null;
  preview: string | null;
  id: number | null
}

const SurveyImages = ({
                        data,
                        updateData
                      }: surveyImageProps) => {
  const [images, setImages] = useState<ImageState[]>([
    {file: null, preview: null, id: null},
    {file: null, preview: null, id: null},
    {file: null, preview: null, id: null},
  ]);

  useEffect(() => {
    const newImages: ImageState[] = [
      {file: null, preview: null, id: null},
      {file: null, preview: null, id: null},
      {file: null, preview: null, id: null}
    ];

    if(data.surveyData?.images?.length > 0) {
      data.surveyData.images.forEach((image: any, index: number) => {
        if(index < 3) {
          newImages[index] = {
            file: null,
            preview: image.url,
            id: parseInt(image.file_id)
          };
        }
      });
    }

    setImages(newImages);
  }, [data.surveyData?.images]);

  const handleImageChange = (index: number) => async (file: File | null) => {
    let newImages = [...images];
    if (file) {
      const response = await uploadWorkOrderSurveyImage(file)

      if (!response || response?.status !== 201) {
        showError('อัปโหลดไม่สำเร็จ')
        return
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newImages[index] = {
          file,
          preview: e.target?.result as string,
          id: response?.data?.id as number
        };
        setImages([...newImages]);
        updateSurveyData(newImages)
      };
      reader.readAsDataURL(file);
    } else {
      newImages[index] = {file: null, preview: null, id: null};
      console.log('newImage >>>> ', newImages)
      setImages([...newImages]);
      updateSurveyData(newImages)
    }
  };

  const updateSurveyData = (newImages: ImageState[]) => {
    console.log('newImages >>> ', newImages)
    const newSurveyData = {
      ...data,
      images: newImages.filter((image) => image.id !== null).map((image) => image.id)
    } as Survey

    updateData(newSurveyData)
  }

  return (
    <CardCollapse title="รูปแนบเพิ่มเติม">
      <div className="w-full">
        <div className="flex flex-wrap">
          {images.map((image, index) => (
            <div key={index} className="md:w-1/3 w-full px-3">
              <ImageUploadCard
                value={image.preview}
                onChange={handleImageChange(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </CardCollapse>
  )
}

export default SurveyImages;
