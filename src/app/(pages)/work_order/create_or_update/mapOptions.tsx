import {Assignee, Options, RequestServiceItem} from "@/types";
import handleSearchServiceEquipmentType from "@/app/helpers/SearchServiceEquipmentType";
import handleSearchEvent from "@/app/helpers/SearchEvent";
import handleSearchMainWorkCenter from "@/app/helpers/SearchMainWorkCenter";

export const mapRequestServiceOptions = (
  reqServiceData: RequestServiceItem[],
  serviceEquipmentOptions: Options[],
  requestCode: string
): Options[] => {
  let newOptions = serviceEquipmentOptions
  reqServiceData.map(async (sv: RequestServiceItem) => {
    const inOption = serviceEquipmentOptions.find((opt) => opt.value === sv.item_id)
    if(!inOption) {
      const options = await handleSearchServiceEquipmentType(sv.item_id, requestCode)
      newOptions = [...serviceEquipmentOptions, ...options]
    }
  })

  return newOptions
}

export const mapEventOptions = (
  assignees: Assignee[],
  eventOptions: Options[],
): Options[] => {
  let newOptions = eventOptions
  assignees.map(async (assignee: Assignee) => {
    const inOption = eventOptions.find((opt) => opt.value === assignee.workActivityTypeId)
    if (!inOption) {
      const options = await handleSearchEvent(assignee.workActivityTypeId)
      newOptions = [...eventOptions, ...options]
    }
  })

  return newOptions
}

export const mapWorkCenterOptions = (
  assignees: Assignee[],
  workCenterOptions: Options[],
): Options[] => {
  let newOptions = workCenterOptions
  assignees.map(async (assignee: Assignee) => {
    const inOption = workCenterOptions.find((opt) => opt.value === assignee.workCenterId)
    if (!inOption) {
      const options = await handleSearchMainWorkCenter(assignee.workCenterId)
      newOptions = [...workCenterOptions, ...options]
    }
  })

  return newOptions
}
