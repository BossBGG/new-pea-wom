import { createTableListApi, TableListApi } from "@/app/api/TableApiHelper";
import api, { ApiResponse } from "@/app/api/Api";
import { MaterialEquipmentObj, MaterialOptionObj } from "@/types";
import {
  addMaterialType,
  updateMaterialType,
} from "@/app/(pages)/material_equipment/[id]/page";

const path = "v1/material-equipment";
export const MaterialEquipmentList: TableListApi<MaterialEquipmentObj[]> =
  createTableListApi(path, api);

export const MaterialEquipmentListById = (
  id: string
): Promise<
  ApiResponse<{ name: string; materialAndEquipment: MaterialEquipmentObj[] }>
> => {
  return api.get(`${path}/${id}`);
};

export const deleteMaterialEquipment = (id: string): Promise<ApiResponse> => {
  return api.delete(`${path}/${id}`);
};

export const updateActiveStatusMaterial = (id: string, isActive: boolean) => {
  return api.patch(`${path}/${id}`, { isActive });
};

export const getMaterialOptions = (
  search: string = ""
): Promise<ApiResponse<MaterialOptionObj[]>> => {
  return api.get(`v1/material-master?search=${search}`);
};

export const updateActiveStatusEquipment = (id: number, isActive: boolean) => {
  return api.patch(`${path}/${id}`, { isActive });
};

export const createDataMaterials = (data: {
  name: string;
  isActive: boolean;
  materialAndEquipment: {
    name: string;
    code: string;
    quantity: number;
    unit: string;
  }[];
}): Promise<ApiResponse> => {
  return api.post(path, data);
};

export const updateDataMaterials = (
  id: string,
  data: {
    name: string;
    isActive?: boolean;
    addMaterials: addMaterialType[];
    updateMaterials: updateMaterialType[];
    removeMaterialIds?: number[];
  }
): Promise<ApiResponse> => {
  return api.patch(`${path}/${id}`, data);
};
