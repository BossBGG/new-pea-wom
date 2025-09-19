import {
  ResponsiblePersonObj
} from "@/app/(pages)/work_order/(special-form)/component/material_equipment_checklist/ResponsiblePersonColumns";

export interface Maintenance {
  key: string;
  value: string;
}

export interface MenuItem {
  name: string;
  href: string;
  icon?: string;
  isTitle?: boolean;
  key?: string;
}

export interface PEAProfile {
  code: string;
  prefix: string;
  first_name: string;
  last_name: string;
  job_position: string;
  affiliated: string;
  phone: string;
  email: string;
}

export interface NewsItem {
  uuid: number | null;
  title: string;
  description: string;
  content: string;
  publishDateStart: string;
  publishDateEnd: string;
  is_new: boolean;
  coverImageFile?: {
    mediaType: string;
    originalName: string;
    url: string;
    uuid: string;
  };
}

export interface Pagination {
  limit: number;
  page: number;
  totalCount: number;
}

export interface Options {
  label: string;
  value: string | number;
  subOptions?: Options[];
  description?: string;
  data?: any
}

export interface MaterialEquipmentObj {
  code: string;
  uuid: string;
  id: number;
  quantity: number | string;
  size?: string;
  unit: string;
  name: string;
  price?: number | string;
  isActive: boolean;
  isUpdate: boolean;
  isEdited: boolean;
}

export interface TransformerMaterialEquipmentObj {
  code: string;
  uuid: string;
  id: number;
  quantity: number | string;
  unit: string;
  name: string;
  phase: string;
  type: string;
  size: string;
  pressure: string;
  serial: string;
  price?: number | string;
  isActive: boolean;
  isUpdate: boolean;
  isEdited: boolean;
}

export type SystemLogObj = {
  id: string;
  uuid: string;
  createdAt: string;
  logType:
    | "error"
    | "info"
    | "warning"
    | "critical"
    | "debug"
    | "notice"
    | "success"
    | "caution";
  userFirstName: string;
  userLastName: string;
  userProfileImageUrl: string;
  detail: string;
  old_detail: string;
  ipAddress: string;
  attributeName: string;
  fromValue: string;
  toValue: string;
  requestNo: string;
};

export type WorkOrderObj = {
  id: string,
  workOrderNo: string;
  customerName: string;
  customerMobileNo: string,
  customerAddress: string,
  customerEmail: string,
  customerBp: string,
  customerCa: string,
  customerLatitude: string,
  customerLongitude: string,
  requestServiceDetail: RequestServiceDetail | string,
  businessTypeId: string,
  businessTypeName: string,
  assignees: Assignee[],
  responsible: ResponsiblePersonObj[],
  appointmentDate: Date | string | undefined,

  sheetType: sting;
  serviceType: string;
  serviceTypes: string[]
  organization: string[];
  order_no: string | number;
  request_no: string | number;
  request_sap_no: string | number;
  request_type: string;
  request_status: string;
  job_priority: string;
  payment_received_date: string;
  work_description: string;
  pea_office: string;
  plant_code: string;
  main_work_center: string;
  cost_center: string;
  customer_info: Customer;
  electrical: Electrical[];
  // equipments: Equipments[];
  workers: WorkerObj[];
  insulators: Insulator[];
  transformer: Transformer[];
  meterequipment: MeterEquipment[];
};

type RequestServiceItem = {
  item_id: string;
  quantity: number | string;
  isUpdate?: boolean
  isEdited?: boolean
}

type Assignee = {
  id: number;
  name: string;
  username: string;
  userType: string;
  workCenterId: string;
  unit: string;
  workActivityTypeId: string;
  workHours: number | string;
  isEquipmentResponsible?: boolean
  isUpdate?: boolean
  isEdited?: boolean
}

type Customer = {
  customer_name: string;
  customer_mobile_no: string;
  customer_address: string;
  customer_bp: string;
  customer_ca: string;
  customer_latitude: string;
  customer_longitude: string;
  customer_email: string;
};

type Electrical = {
  id: number;
  name: string;
  size?: string;
  quantity: number;
  isUpdate?: boolean;
  isEdited: boolean;
};

type Equipments = {
  id: number;
  name: string;
  equipmentId: string;
  equipmentAmount: string | number;
  unitPrice: number;
  totalPrice: number;
  isUpdate?: boolean;
  isEdited: boolean;
};

export type ElectricalEquipment = {
  id: number;
  name: string;
  quantity: number;
  isUpdate?: boolean;
  isEdited: boolean;
};

export type Transformer = {
  id: number;
  name: string;
  quantity?: number;
  phase?: string;
  type?: string;
  size?: string;
  pressure?: string;
  serial?: string;
  isUpdate?: boolean;
  isEdited: boolean;
};

export type Insulator = {
  id: number;
  name?: string;
  insulator_type?: string;
  quantity: number;
  isUpdate?: boolean;
  isEdited: boolean;
};

export type MeterEquipment = {
  id: number;
  equipment_name: string;
  size: string;
  quantity: number;
  price?: number;
  isUpdate?: boolean;
  isEdited: boolean;
};

type WorkerObj = {
  isUpdate?: boolean;
  isEdited: boolean;
  group: string;
  operation_center: string;
  id: number;
  hours: number;
  unit: string;
  worker_id?: string;
  worker: string;
  event: string;
  group_worker: string;
};

interface User {
  department: string;
  email: string;
  username: string;
  employeeCode: string;
  selectedPeaOffice: string;
  firstName: string;
  lastName: string;
  phoneNumber: null | string;
  position: null | string;
  prefix: null | string;
  profileImageUrl: null | string;
  signatureImageUrl: null | string;
  signatureType: null | string;
  type: string;
  uuid: string;
}

export interface MaterialOptionObj {
  id: number;
  code: string; //รหัสวัสดุ
  name: string; //ชื่อวัสดุ
  unit: string; //หน่วย
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean; // Optional เพราะ API ไม่ส่งมา
}

export interface PeaOfficeObj {
  regiongroup: string;
  office: string;
  peaNameFull: string
}

export interface SubServiceType {
  // children: []
  detail: string
  id: string
  name: string
  priority: number
  requestCode: string
  requestTypeCode: string
  type: string
}

export interface ServiceType {
  id: string,
  name: string,
  services: SubServiceType[]
}

export interface SubPeaOrganize {
  id: string,
  level: string,
  name: string,
  office: string,
  regiongroup: string,
  children?: SubPeaOrganize[]
}

export interface PeaOrganize {
  id: string,
  level: string,
  name: string,
  regiongroup: string,
  children: SubPeaOrganize[];
}

export type ServiceRequest = {
  id: string,
  requestNo: string,
  serviceType: string,
  createdDate: string,
  customerName: string
}

export type BusinessTypeObj = {
  id: string,
  name: string
}

export type Event = {
  id: number,
  ktext: string
}

export type MainWorkCenter = {
  Id: number,
  Ktext: string
}

export type ServiceEquipment = {
  id: string,
  option_title: string
}

export interface ResponsiblePersonObj {
  id: number | string;
  username: string;
  isUpdate: boolean;
  isEdited: boolean;
}

export type RequestServiceDetail = {
  business_type_id?: string,
  transformer_voltage?: string,
  items: RequestServiceItem[],
}

export type TransFormerVoltage = {
  id: string
  option_title: string
}
