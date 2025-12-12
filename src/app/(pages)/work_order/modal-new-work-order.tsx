import Modal from "@/app/layout/Modal";
import { Button } from "@/components/ui/button";
import InputRadio from "@/app/components/form/InputRadio";
import {
  BulkWorkOrderCreateItem,
  Options,
  ServiceRequest,
  WorkOrderCreateItem,
  WorkOrderObj,
} from "@/types";
import React, { useEffect, useState } from "react";
import InputSelect from "@/app/components/form/InputSelect";
import { useRouter } from "next/navigation";
import { dismissAlert, showError, showProgress } from "@/app/helpers/Alert";
import {
  getPeaOfficeOptions,
  getServiceTypeOptions,
} from "@/app/api/WorkOrderOptions";
import InputSearch from "@/app/components/form/InputSearch";
import InputGroupCheckbox from "@/app/components/form/InputGroupCheckbox";
import ServiceTypeSelection from "@/app/(pages)/work_order/service-type-selection";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import ServiceRequestRefTable from "@/app/(pages)/work_order/reference_table/service-request-ref-table";
import WorkOrderRefTable from "@/app/(pages)/work_order/reference_table/work-order-ref-table";
import ServiceRequestRefList from "@/app/(pages)/work_order/reference_list/service-request-ref-list";
import { CreateBulkWorkOrder, DraftWorkOrder } from "@/app/api/WorkOrderApi";
import { setCustomerRequestData } from "@/app/redux/slices/CustomerRequestSlice";
import { WorkOrderRefList } from "@/app/(pages)/work_order/reference_list/work-order-ref-list";
import {cn} from "@/lib/utils";
import {MOBILE_SCREEN} from "@/app/redux/slices/ScreenSizeSlice";

interface ModalNewWorkOrderProps {
  open: boolean;
  onClose: () => void;
  workOrderType: "ref_service_req" | "not_reference" | "ref_work_order";
}

const FooterModal = ({
  cancel,
  submit,
}: {
  cancel: () => void;
  submit: () => void;
}) => (
  <div className="w-full flex flex-wrap justify-between items-center">
    <div className="p-2 w-1/2">
      <Button
        className="text-[#671FAB] w-full bg-white border-1 border-[#671FAB] rounded-full font-semibold md:text-start text-center cursor-pointer hover:bg-white"
        onClick={() => cancel()}
      >
        ยกเลิก
      </Button>
    </div>
    <div className="p-2 w-1/2">
      <Button className="pea-button w-full" onClick={() => submit()}>
        สร้างใบสั่งงาน
      </Button>
    </div>
  </div>
);

const ModalNewWorkOrder = ({
  open,
  onClose,
  workOrderType,
}: ModalNewWorkOrderProps) => {
  const router = useRouter();
  const [serviceTypeOptions, setServiceTypeOptions] = useState<Options[]>([]);
  const [requestCodeOptions, setRequestCodeOptions] = useState<Options[]>([]);
  const [organizationTypeOptions, setOrganizationTypeOptions] = useState<
    Options[]
  >([]);
  const screen_size = useAppSelector((state) => state.screen_size);
  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([fetchServiceTypeOptions(), fetchPeaOfficeOptions()]).then(
      ([resServiceType, resOrgType]) => {
        const org_type_options = resOrgType || [];
        setOrganizationTypeOptions(org_type_options);
      }
    );
  }, []);

  const fetchServiceTypeOptions = async () => {
    const resp = await getServiceTypeOptions();
    if (resp.status === 200 && resp.data.data && resp.data.data.serviceGroups) {
      const service_options: Options[] = [];
      const req_code_options: Options[] = [];
      resp.data.data.serviceGroups.map((item) => {
        const sub_service_options = item.services?.map((sub) => {
          return {
            value: sub.id,
            label: `${sub.requestCode} ${sub.name}`,
            data: sub,
          };
        });

        const sub_reqcode_options = item.services?.map((sub) => {
          return {
            value: sub.requestCode,
            label: `${sub.requestCode} ${sub.name}`,
            data: sub,
          };
        });

        const service_option: Options = {
          value: item.id,
          label: item.name,
          subOptions: sub_service_options,
        };

        const req_code_option: Options = {
          value: item.id,
          label: item.name,
          subOptions: sub_reqcode_options,
        };

        service_options.push(service_option);
        req_code_options.push(req_code_option);
      });
      setServiceTypeOptions(service_options);
      setRequestCodeOptions(req_code_options);
    }
  };

  const fetchPeaOfficeOptions = async () => {
    const resp = await getPeaOfficeOptions();
    if (resp.status === 200 && resp.data.data) {
      const org_data = resp.data.data.data;
      const options: Options[] = [];
      org_data.map((item) => {
        const sub_options = item.children?.map((sub) => {
          const childrens: Options[] = [];
          sub.children?.map((sub) => {
            childrens.push({
              value: sub.office,
              label: sub.office ? `${sub.name} [${sub.office}]` : sub.name,
              data: sub,
            });
          });

          return {
            value: sub.id,
            label: sub.office ? `${sub.name} [${sub.office}]` : sub.name,
            data: sub,
            subOptions: childrens,
          };
        });

        const option: Options = {
          value: item.id,
          label: item.name,
          subOptions: sub_options,
        };

        options.push(option);
      });

      return options;
    }
    return [];
  };

  const workOrderTypeOptions: Options[] = [
    {
      label: "ใบสั่งงาน",
      value: "single",
      description: "สร้างใบสั่งงานแบบใบเดียว",
    },
    {
      label: "ใบสั่งงานเป็นชุด",
      value: "bulk",
      description: "สร้างใบสั่งงานแบบหลายใบ",
    },
  ];

  const [data, setData] = useState<WorkOrderCreateItem>({
    serviceId: "",
    workOrderType: "single",
  });

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (open) {
      setSearch("");
    }
  }, [open]);

  const getBulkType = () => {
    switch (workOrderType) {
      case "ref_service_req":
        return "reference_request";
      case "not_reference":
        return "no_reference";
      case "ref_work_order":
        return "reference_parent";
    }
  };

  const submit = async () => {
    showProgress();
    if (!data.serviceId && workOrderType === "not_reference") {
      dismissAlert();
      alert("กรุณาเลือกประเภทงานบริการ");
      return;
    }

    let res = null;
    if (data.workOrderType === "single") {
      let item: WorkOrderCreateItem = {
        serviceId: data.serviceId,
        workOrderType: data.workOrderType,
      };

      if (workOrderType === "ref_service_req") {
        item = { ...item, customerRequestNo: data.customerRequestNo };
      } else if (workOrderType === "ref_work_order") {
        item = { ...item, workOrderParentId: data.workOrderParentId };
      }

      res = await DraftWorkOrder(item);
    } else {
      const bulkType = getBulkType();
      let bulkItem: BulkWorkOrderCreateItem = {
        bulkType: bulkType,
        selectedPeaOffices: data.selectedPeaOffices || [],
        mainWorkOrder: {
          serviceId: data.serviceId,
        },
      };

      if (workOrderType === "ref_service_req") {
        bulkItem = {
          ...bulkItem,
          customerRequestNo: data.customerRequestNo as string,
        };
      } else if (workOrderType === "ref_work_order") {
        bulkItem = {
          ...bulkItem,
          existingParentWorkOrderId: data.workOrderParentId as string,
        };
      }

      res = await CreateBulkWorkOrder(bulkItem);
    }

    if (res?.data.status_code === 201) {
      let service: string | null = data.requestCode?.toLowerCase() || null;
      const serviceData = res?.data.data || ({} as WorkOrderObj);
      const peaOfficeCode =
        (serviceData?.peaOfficeCode as string) ||
        serviceData?.mainWorkOrder?.peaOffice ||
        "";
      const peaOfficeName =
        (serviceData?.peaOfficeName as string) ||
        (serviceData?.peaNameFull as string) ||
        serviceData?.mainWorkOrder?.peaNameFull ||
        "";

      const item = {
        workOrderNo: serviceData?.workOrderNo || serviceData?.mainWorkOrder?.workOrderNo || "",
        peaNameFull: peaOfficeName,
        peaOffice: peaOfficeCode,
        officePlant:
          (serviceData?.officePlant as string) ||
          serviceData?.mainWorkOrder?.officePlant,
        costCenter:
          (serviceData?.costCenter as string) ||
          serviceData?.mainWorkOrder?.costCenter,
        customerRequestNo: data.customerRequestNo || serviceData.customerRequestNo || "",
        workOrderParentId: data.workOrderParentId || "",
        sapOrderNo: serviceData.sapOrderNo || "",
        serviceName: serviceData.serviceName || serviceData?.mainWorkOrder?.serviceName || ""
      } as ServiceRequest;

      console.log("item >>> ", item);
      dispatch(setCustomerRequestData(item));

      console.log("service >>> ", service);
      if (!service) {
        serviceTypeOptions.map((ser) => {
          if (ser.subOptions) {
            const subService = ser.subOptions.find(
              (sub) => sub.data.id === data.serviceId
            );
            console.log("subService >>>>", subService);
            if (subService) {
              service = subService.data.requestCode.toLowerCase();
            }
          }
        });
      }

      console.log("after find service >>>>> ", service);
      if (service) {
        const resData = res?.data?.data;
        let id = resData?.id ?? "";

        if (resData?.mainWorkOrder?.id) {
          //การสร้างแบบเป็นชุด อ้างอิงใบสั่งงานหลัก
          id = resData.mainWorkOrder.id;
        } else if (resData?.results && resData.results.length > 0) {
          //การสร้างแบบเป็นชุด อ้างอิงใบคำร้อง
          id = resData.results[0].id || "";
        }

        const params = new URLSearchParams({
          id,
          requestCode: (service as string) || "",
        });

        router.push(`/work_order/create_or_update?${params.toString()}`);
      } else {
        handleClose()
        showError("ไม่สามารถสร้างใบคำร้องได้ เนื่องจากไม่พบประเภทบริการ");
      }
      dismissAlert();
    } else {
      console.log("res.data >>>", res ?? "");
      handleClose()
      showError(res?.data.message || "");
    }
  };

  const handleUpdateData = (
    key: keyof WorkOrderCreateItem,
    value: string | number | string[]
  ) => {
    setData((prevState) => ({ ...prevState, [key]: value }));
  };

  useEffect(() => {
    if (open && !data.serviceTypes) {
      handleUpdateData("serviceTypes", []);
    }
  }, [open]);

  // useEffect(() => {
  //   if (!data.serviceTypes) {
  //     handleUpdateData("serviceTypes", []);
  //   }
  // });

  const renderTitle = () => {
    switch (workOrderType) {
      case "ref_service_req":
        return "สร้างใบสั่งงาน อ้างอิงใบคำร้อง";
      case "ref_work_order":
        return "สร้างใบสั่งงานย่อย อ้างอิงใบสั่งงานหลัก";
      default:
        return "สร้างใบสั่งงานใหม่";
    }
  };

  const handleClose = () => {
    setData({
      serviceId: "",
      workOrderType: "single",
      customerRequestNo: "",
      search: "",
      serviceTypes: undefined,
    } as WorkOrderCreateItem);
    onClose();
  };

  return (
    <Modal
      title={renderTitle()}
      open={open}
      onClose={() => handleClose()}
      footer={
        <FooterModal cancel={() => handleClose()} submit={() => submit()} />
      }
      classContent="w-[80%] xl:w-[65%] 2xl:w-[50%] !max-w-[80%]"
    >
      <div className="w-full overflow-y-hidden">
        <InputRadio
          label="เลือกประเภทการสร้างใบงาน"
          options={workOrderTypeOptions}
          value={
            (data.workOrderType as string) ||
            (workOrderTypeOptions[0].value as string)
          }
          setData={(v: string) => handleUpdateData("workOrderType", v)}
          classItem="rounded-[12px] p-3 w-full border-1"
          classItemChecked="border-1 border-[#671FAB]"
          classLabel="flex flex-col items-start"
          className={
            cn('flex', screen_size === MOBILE_SCREEN && "flex-wrap")
          }
        />

        <div>
          {["ref_service_req", "ref_work_order"].includes(workOrderType) && (
            <div>
              <div className="my-2">
                {workOrderType === "ref_service_req"
                  ? "ค้นหาเลขที่ใบคำร้อง"
                  : "ค้นหาเลขที่ใบสั่งงาน"}
              </div>
              <InputSearch
                handleSearch={setSearch}
                placeholder={
                  workOrderType === "ref_service_req"
                    ? "ค้นหาเลขที่ใบคำร้อง"
                    : "ค้นหาเลขที่ใบสั่งงาน"
                }
              />
            </div>
          )}

          {workOrderType !== "not_reference" && (
            <div className="my-3">
              {/*ประเภทงานบริการ สำหรับใช้ในการ filter ข้อมูล*/}
              <ServiceTypeSelection
                options={requestCodeOptions}
                setData={(services: string[]) =>
                  handleUpdateData("serviceTypes", services)
                }
                selected={data.serviceTypes || []}
              />
            </div>
          )}

          {open && workOrderType === "ref_service_req" && (
            <div className="my-3 w-full">
              {screen_size !== MOBILE_SCREEN ? (
                <ServiceRequestRefTable
                  data={data}
                  updateData={setData}
                  search={search}
                  requestCodes={data.serviceTypes!}
                />
              ) : (
                <ServiceRequestRefList
                  data={data}
                  updateData={setData}
                  search={search}
                  requestCodes={data.serviceTypes!}
                />
              )}
            </div>
          )}

          {open && workOrderType === "ref_work_order" && (
            <div className="my-3 w-full">
              {screen_size !== MOBILE_SCREEN ? (
                <WorkOrderRefTable
                  data={data}
                  updateData={setData}
                  search={search}
                  requestCodes={data.serviceTypes!}
                />
              ) : (
                <WorkOrderRefList
                  data={data}
                  updateData={setData}
                  search={search}
                  requestCodes={data.serviceTypes!}
                />
              )}
            </div>
          )}

          {workOrderType === "not_reference" && (
            //ใช้สำหรับเลือกข้อมูล serviceId เพื่อส่งไปให้ backend
            <div className="my-3 w-full">
              <InputSelect
                options={serviceTypeOptions}
                value={data.serviceId}
                placeholder="เลือกประเภทงานบริการ"
                setData={(v: string | number) =>
                  handleUpdateData("serviceId", v)
                }
                label="ประเภทงานบริการ"
              />
            </div>
          )}
        </div>

        {data.workOrderType === "bulk" && (
          <div className="mt-3">
            <div>เลือกหน่วยงาน</div>
            <InputGroupCheckbox
              options={organizationTypeOptions}
              setData={(d: string[]) =>
                handleUpdateData("selectedPeaOffices", d)
              }
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalNewWorkOrder;
