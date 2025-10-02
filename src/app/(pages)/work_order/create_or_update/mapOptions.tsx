import {
  Assignee,
  MeterEquipment,
  Options,
  RequestServiceItem,
  S301EquipmentServiceData,
  S318EquipmentServiceData,
  Transformer
} from "@/types";
import handleSearchServiceEquipmentType from "@/app/helpers/SearchServiceEquipmentType";
import handleSearchEvent from "@/app/helpers/SearchEvent";
import handleSearchMainWorkCenter from "@/app/helpers/SearchMainWorkCenter";
import {
  handleSearchTransformerBrands,
  handleSearchTransformerPhase, handleSearchTransformerSize,
  handleSearchTransformerType, handleSearchTransformerVoltage
} from "@/app/helpers/SearchTransformer.";
import { getMeterEquipmentOptions } from "@/app/api/MaterialEquipmentApi";
import {searchMeterEquipmentOptions} from "@/app/helpers/SearchMeterEquipment";

export const mapRequestServiceOptions =async (
  reqServiceData: S301EquipmentServiceData[],
  serviceEquipmentOptions: Options[],
  requestCode: string
): Promise<Options[]> => {
  let newOptions = [...serviceEquipmentOptions]
  await Promise.all(
    reqServiceData.map(async (sv: S301EquipmentServiceData) => {
      const inOption = serviceEquipmentOptions.find((opt) => opt.value == sv.equipmentTypeId)
      if(!inOption) {
        const options = await handleSearchServiceEquipmentType(sv.equipmentTypeId, requestCode)
        newOptions = [...serviceEquipmentOptions, ...options]
      }
    })
  )

  return newOptions
}

export const mapEventOptions = async (
  assignees: Assignee[],
  eventOptions: Options[],
): Promise<Options[]> => {
  let newOptions = [...eventOptions]

  await Promise.all(
    assignees.map(async (assignee: Assignee) => {
      const inOption = eventOptions.find(
        (opt) => opt.value == assignee.workActivityTypeId
      )

      if (!inOption) {
        const options = await handleSearchEvent(assignee.workActivityTypeId)
        newOptions = [...newOptions, ...options]
      }
    })
  )

  return newOptions
}

export const mapWorkCenterOptions = async (
  assignees: Assignee[],
  workCenterOptions: Options[],
): Promise<Options[]> => {
  let newOptions = [...workCenterOptions]

  await Promise.all(
    assignees.map(async (assignee: Assignee) => {
      const inOption = workCenterOptions.find((opt) => opt.value == assignee.workCenterId)
      if (!inOption) {
        const options = await handleSearchMainWorkCenter(assignee.workCenterId)
        newOptions = [...workCenterOptions, ...options]
      }
    })
  )

  return newOptions
}

export const mapTransformerBrandOptions = async (
  transformers: Transformer[],
  transformerBrandOptions: Options[],
  reqCode: string
): Promise<Options[]> => {
  let newOptions = [...transformerBrandOptions]

  await Promise.all(
    transformers.map(async (transformer: Transformer) => {
      const inOption = transformerBrandOptions.find((opt) => opt.value == transformer.title)
      if (!inOption) {
        const options = await handleSearchTransformerBrands(transformer.title, reqCode)
        newOptions = [...transformerBrandOptions, ...options]
      }
    })
  )

  return newOptions
}

export const mapTransformerPhaseOptions = async (
  transformers: Transformer[],
  transformerPhaseOptions: Options[],
  reqCode: string
): Promise<Options[]> => {
  let newOptions = [...transformerPhaseOptions]

  await Promise.all(
    transformers.map(async (transformer: Transformer) => {
      const inOption = transformerPhaseOptions.find((opt) => opt.value == transformer.phase)
      if (!inOption) {
        const options = await handleSearchTransformerPhase(transformer.phase, reqCode)
        newOptions = [...transformerPhaseOptions, ...options]
      }
    })
  )

  return newOptions
}

export const mapTransformerTypeOptions = async (
  transformers: Transformer[],
  transformerTypeOptions: Options[],
  reqCode: string
): Promise<Options[]> => {
  let newOptions = [...transformerTypeOptions]

  await Promise.all(
    transformers.map(async (transformer: Transformer) => {
      const inOption = transformerTypeOptions.find((opt) => opt.value == transformer.type)
      if (!inOption) {
        const options = await handleSearchTransformerType(transformer.type, reqCode)
        newOptions = [...transformerTypeOptions, ...options]
      }
    })
  )

  return newOptions
}

export const mapTransformerSizeOptions = async (
  transformers: Transformer[],
  transformerSizeOptions: Options[],
  reqCode: string
): Promise<Options[]> => {
  let newOptions = [...transformerSizeOptions]

  await Promise.all(
    transformers.map(async (transformer: Transformer) => {
      const inOption = transformerSizeOptions.find((opt) => opt.value == transformer.size)
      if (!inOption) {
        const options = await handleSearchTransformerSize(transformer.size, reqCode)
        newOptions = [...transformerSizeOptions, ...options]
      }
    })
  )

  return newOptions
}

export const mapTransformerVoltageOptions = async (
  transformers: Transformer[],
  transformerVoltageOptions: Options[],
  reqCode: string
): Promise<Options[]> => {
  let newOptions = [...transformerVoltageOptions]

  await Promise.all(
    transformers.map(async (transformer: Transformer) => {
      const inOption = transformerVoltageOptions.find((opt) => opt.value == transformer.voltage)
      if (!inOption) {
        const options = await handleSearchTransformerVoltage(transformer.voltage, reqCode)
        newOptions = [...transformerVoltageOptions, ...options]
      }
    })
  )

  return newOptions
}

export const mapMeterEquipmentOptions = async (
  meterEquipments: S318EquipmentServiceData[],
  meterEquipmentOptions: Options[],
  requestCode: string
): Promise<Options[]> => {
  let newOptions = [...meterEquipmentOptions];

  await Promise.all(
    meterEquipments.map(async (equipment: S318EquipmentServiceData) => {
      const inOption = meterEquipmentOptions.find(
        (opt) => opt.value == equipment.equipmentId
      );

      if(!inOption) {
        const options = await searchMeterEquipmentOptions(equipment.equipmentId, requestCode)
        newOptions = [...options]
      }
    })
  );

  return newOptions;
};
