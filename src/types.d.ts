import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

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
  equipmentId?: string;
  equipmentAmount?: string | number;
  unitPrice?: string | number;
  remaining?: number | string;
  isActive: boolean;
  isUpdate: boolean;
  isEdited: boolean;

  materialSetUuid?: string;
  originalId?: number;
}

export interface MaterialSetItem {
  id: number;
  code: string;
  name: string;
  quantity: number;
  unit: string;
  isActive: boolean;
  price: number;
}

export interface MaterialSet {
  uuid: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string | null;
  deletedBy: string | null;
  materialAndEquipment: MaterialSetItem[];
}

export interface MaterialSetsResponse {
  items: MaterialSet[];
}

export interface MaterialMaster {
  id: number;
  code: string;
  name: string;
  unit: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface MeterEquipmentService {
  id: string;
  services_id: string;
  item_slug: string;
  item_name: string;
  item_description: string | null;
  option_title: string;
  sub_id: string | null;
  order: number;
  is_other: boolean;
  is_active: boolean;
  is_del: boolean;
  created_date: string;
  created_by: string;
  updated_date: string | null;
  updated_by: string | null;
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
  requestCode: string;
  workOrderNo: string;
  customerName: string;
  customerRequestNo?: string;
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
  appointmentDate: Date | string | undefined,
  workOrderStatusCode: string
  statusCode: string

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
  // transformer: Transformer[];
  meterequipment: MeterEquipment[];
  materialEquipments?: MaterialEquipmentObj[];
};

interface RequestServiceItem {
  item_id: string;
  quantity: number | string;
  isUpdate?: boolean
  isEdited?: boolean
}

type Assignee = {
  id: number;
  Id?: number;
  index?: number;
  name: string;
  username: string;
  userType: string;
  workCenterId: string;
  workUnit: string;
  workActivityTypeId: string;
  workHours: number | string;
  workOrderId?: string
  sequenceNo?: number
  isRead?: boolean
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
  title: string;
  phase: string;
  type: string;
  serial: string;
  size: string;
  voltage: string;
  isUpdate?: boolean;
  isEdited?: boolean;
};

export type Insulator = {
  id: number;
  item_title: string;
  quantity: number;
  isUpdate?: boolean;
  isEdited?: boolean;
};

interface MeterEquipmentServiceItem {
  item_id: string;
  item_size: number;
  quantity: number;
  price: number;
}

export type MeterEquipment = {
  id: number | string; 
  equipment_id?: string;
  equipment_name: string;
  size: string | number;
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
  serviceId: string,
  requestCode: string,
  serviceType: string,
  createdDate: string,
  customerName: string
  customerRequestNo: string
  customerAddress: string
  customerMobileNo: string
  serviceGroupName: string
  serviceName: string
  status: string
  statusDescription: string
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

export interface ResponsiblePersonObj {
  id?: number | string;
  username: string;
  isUpdate: boolean;
  isEdited: boolean;
}

export interface RequestServiceDetail extends InverterData, SiteSurveyAirCondition {
  business_type_id?: string,
  package_id?: string,
  transformer_voltage?: string,
  request_type?: string,
  service_type?: string,
  items: RequestServiceItem[] | Transformer[] | Insulator[] | MeterEquipmentServiceItem[],
  renewable_source_id: string,
  renewable_type_id: string,
  source_other: string,
  year: Date | undefined,
  num_years: string | number
  start_date?: Date | undefined,
  end_date?: Date | undefined
  days?: number
  transformer?: TransFormerS315[]
}

type OptionApi = {
  id: string
  option_title: string
}

export interface TransFormerVoltage extends OptionApi {}
export interface RenewableSource extends OptionApi {}
export interface RenewableType extends OptionApi {}
export interface ServiceEquipment extends OptionApi {}
export interface TransformerOptions extends OptionApi {}

export interface WorkerOptionObj {
  username: string;
  firstName: string;
  lastName: string;
}

export interface TransFormerS315 {
  id?: string | number;
  transformer_size: string;
  transformer_qty: number;
  isUpdate?: boolean;
  isEdited?: boolean;
}

export interface InverterData {
  distanceSolarToInverter: number;
  distanceInverterToPanel: number;
  connectionType: 'LAN' | 'WiFi' | 'other';
  otherConnectionDetail: string;
}

export interface SiteSurveyAirCondition {
  refrigerantPipeDistance: number
  dcCableDistance: number
  acCableDistance: number
  houseFrontDirection: string
}

export interface WorkOrderCreateItem {
  serviceId: string
  workOrderType: string
  requestCode?: string
  customerRequestNo?: string | null
  workOrderParentId?: string
  serviceTypes?: string[]
}

export type ResolvedData = {
  respEventOptions?: Options[];
  resMainWorkCenter?: Options[];
  resWorkerOptions?: Options[];
  resServiceEquipmentOptions?: Options[];
  resBusinessType?: Options[];
  resVoltages?: Options[];
  resRenewableSource?: Options[];
  resRenewableType?: Options[];
  resTransformerBrands?: Options[];
  resTransformerPhase?: Options[];
  resTransformerType?: Options[];
  resTransformerSize?: Options[];
  resReqService?: Options[];
  resServiceTypes?: Options[];
  resMeterEquipmentOptions?: Options[];
};

export interface ElectricGeneratorObj {
  repeat_start_date: Date | undefined,
  repeat_end_date: Date | undefined,
  repeat_start_time: Date | undefined,
  repeat_end_time: Date | undefined,
  repeat_minutes: number
}

export interface StepWorkOrderObj {
  name: string,
  icon: IconDefinition
}
