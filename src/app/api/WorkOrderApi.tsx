import api, {ApiResponse} from "@/app/api/Api";
import {createTableListApi} from "@/app/api/TableApiHelper";
import {
  WorkOrderObj,
  BusinessTypeObj,
  Event,
  MainWorkCenter,
  WorkerOptionObj, Options
} from "@/types";

export  const JobPriorityOptions: Options[] = [
  {value: '1', label: 'สำคัญมาก (24 ชม.)'},
  {value: '2', label: 'สำคัญปานกลาง (2 วัน)'},
  {value: '3', label: 'ปกติ (5 วัน)'}
]

const path = 'v1/work-orders'
export const ServiceRequestRefListApi = createTableListApi(`v1/service-requests`, api)

export const WorkOrderRefListApi = createTableListApi(path, api)

export const WorkOrderListByOffice = (office_id: string)=> createTableListApi(`v1/pea-offices/${office_id}/work-orders`, api)

export const WorkOrderList = createTableListApi(`${path}/my`, api)

export const DraftWorkOrder = (data: any): Promise<ApiResponse<WorkOrderObj>> => {
  return api.post(`${path}/draft`, data)
}

export const CreateBulkWorkOrder = (data: any): Promise<ApiResponse<WorkOrderObj>> => {
  return api.post(`${path}/bulk`, data)
}

export const updateWorkOrder = (id: string, data: WorkOrderObj): Promise<ApiResponse> => {
  return api.put(`${path}/${id}`, data)
}

export const getWorkOrderDetailById = (id: string): Promise<ApiResponse<WorkOrderObj>> => {
  return api.get(`${path}/${id}`)
}

export const updateWorkOrderStatus = (id: string, status: string): Promise<ApiResponse> => {
  return api.put(`${path}/${id}/status`, {workOrderStatusCode: status})
}

export const getBusinessType = (search: string): Promise<ApiResponse<BusinessTypeObj[]>> => {
  return api.get(`v1/business-types`, {
    params: {search}
  })
}

export const getEventOptions = (search: string): Promise<ApiResponse<Event[]>> => {
  return api.get(`v1/activity-types`, {
    params: {search}
  })
}

export const getMainWorkCenterOptions = (search: string): Promise<ApiResponse<MainWorkCenter[]>> => {
  return api.get(`/v1/main-work-centers`, {
    params: {search}
  })
}

export const getWorkerOptions = (search: string): Promise<ApiResponse<WorkerOptionObj[]>> => {
  return api.get(`/v1/users/workers`, {
    params: { search }
  })
}

export const cancelWorkOrder = (id: string): Promise<ApiResponse> => {
  return api.delete(`${path}/${id}`)
}
