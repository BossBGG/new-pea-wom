import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";
import {useAppSelector} from "@/app/redux/hook";
import {DataTableEditor} from "@/app/components/editor-table/DataTableEditor";
import {getColumns} from "@/app/(pages)/work_order/(special-form)/component/worker/columns";
import {Options, WorkerObj, Event, Assignee} from "@/types";
import {useEffect, useState} from "react";
import InputDateButton from "@/app/components/form/InputDateButton";
import {ListDataEditor} from "@/app/components/editor-table/ListDataEditor";
import WorkerListContent from "@/app/(pages)/work_order/(special-form)/component/worker/WorkerListContent";
import {Button} from "@/components/ui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import AddWorker from "@/app/(pages)/work_order/(special-form)/component/worker/AddWorker";

interface WorkerListOptions {
  isReadOnly?: boolean;
  showAddButton?: boolean;
  showDeleteAllButton?: boolean;
  showActionColumn?: boolean;
  showAppointmentSection?: boolean;
}

interface WorkerListProps {
  data: Assignee[];
  options?: WorkerListOptions;
  updateData: (data: Assignee[]) => void;
  eventOptions: Options[],
  workCenterOptions: Options[],
  setEventOptions: (options: Options[]) => void;
  setMainWorkCenterOptions: (options: Options[]) => void;
  appointment_date: Date | undefined
  updateAppointment: (d: Date | undefined) => void
}

const WorkerList = ({
                      data,
                      options = {},
                      updateData,
                      eventOptions,
                      workCenterOptions,
                      setEventOptions,
                      setMainWorkCenterOptions,
                      appointment_date,
                      updateAppointment
                    }: WorkerListProps) => {
  const {
    isReadOnly = false,
    showAddButton = true,
    showDeleteAllButton = true,
    showActionColumn = true,
    showAppointmentSection = true,
  } = options;
  const screenSize = useAppSelector((state) => state.screen_size);
  const [workers, setWorkers] = useState<Assignee[]>(data);
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(appointment_date);
  const [openModal, setOpenModal] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(-1);
  const [editData, setEditData] = useState<Assignee | null>(null);

  useEffect(() => {
    setWorkers(data)
  }, [data]);

  useEffect(() => {
    setAppointmentDate(appointment_date)
  }, [appointment_date]);

  const [groupWorkerOptions] = useState<Options[]>([
    {label: "พนักงาน PEA", value: "peaUser"},
    {label: "Vendor", value: "vendorUser"},
  ]);

  const [workerOptions] = useState<Options[]>([
    {label: "นายจิตนพื้นกต่าง องอาจ", value: "worker_1"},
    {label: "นายสมชาย ใจดี", value: "worker_2"},
    {label: "นางสาวสมหญิง รักงาน", value: "worker_3"},
  ]);

  useEffect(() => {
    console.log('eventOptions >> ', eventOptions)
  }, [eventOptions]);

  const itemWorker: Assignee = {
    isUpdate: true,
  } as Assignee;

  const handleDateChange = (date: Date | undefined) => {
    if (!isReadOnly) {
      setAppointmentDate(date);
      updateAppointment(date);
      console.log("Appointment date selected:", date);
    }
  };

  const handleUpdateData = (data: Assignee[]) => {
    if (!isReadOnly) {
      setWorkers(data);
      updateData?.(data);
    }
  };

  const onRemoveData = (id: number) => {
    if (!isReadOnly) {
      console.log("Remove worker with id:", id);
    }
  };

  const handleAddWorker = (newWorker: Assignee) => {
    if (!isReadOnly) {
      setWorkers((prev) => [...prev, newWorker]);
    }
  };

  const handleUpdateWorker = (item: Assignee) => {
    const newData = workers.map((wk, index) => {
      return index === updateIndex ? item : wk
    })
    handleUpdateData(newData);
  }

  useEffect(() => {
    console.log('workers >>>> ', workers)
  }, [workers]);

  useEffect(() => {
    console.log('eventOptions >>>> ', eventOptions)
  }, []);

  const getFilteredColumns = () => {
    const columns = getColumns(
      groupWorkerOptions,
      workerOptions,
      eventOptions,
      workCenterOptions,
      (d: Options[]) => setEventOptions(d),
      (d: Options[]) => setMainWorkCenterOptions(d)
    );
    if (!showActionColumn || isReadOnly) {
      return columns.filter((column) => column.id !== "action");
    }
    return columns;
  };

  return (
    <div>
      <CardCollapse title={"รายชื่อผู้ปฏิบัติงาน"}>
        {screenSize === "desktop" ? (
          <div className={workers.length === 0 ? 'mb-12' : 'mb-0'}>
            <DataTableEditor
              columns={getFilteredColumns()}
              onUpdateData={handleUpdateData}
              realData={workers}
              onRemoveData={onRemoveData}
              LabelAddRow={
                showAddButton && !isReadOnly ? "เพิ่มผู้ปฏิบัติงาน" : undefined
              }
              rowItem={itemWorker}
              visibleDelete={showDeleteAllButton && !isReadOnly}
              classActionRow={`absolute ${workers.length > 0 ? 'bottom-19' : 'bottom-0'} right-2`}
              classPagination="mt-12"
            />
          </div>
        ) : (
          <ListDataEditor onUpdateData={handleUpdateData} realData={workers}>
            {(pageData: Assignee[], page, pageSize) => (
              <div>
                <WorkerListContent
                  pageData={pageData}
                  realData={workers}
                  page={page}
                  pageSize={pageSize}
                  onUpdateData={handleUpdateData}
                  groupWorkerOptions={groupWorkerOptions}
                  workerOptions={workerOptions}
                  workCenterOptions={workCenterOptions}
                  eventOptions={eventOptions}
                  onRemoveData={onRemoveData}
                  setUpdateIndex={(index) => {
                    setEditData(workers[index])
                    setUpdateIndex(index);
                    setOpenModal(true);
                  }}
                  showActionButtons={showActionColumn && !isReadOnly}
                  isReadOnly={isReadOnly}
                />

                {showAddButton && !isReadOnly && (
                  <Button
                    className="pea-button-outline my-2 w-full"
                    onClick={() => {
                      setOpenModal(true)
                      setEditData(null)
                      setUpdateIndex(-1)
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                    เพิ่มผู้ปฏิบัติงาน
                  </Button>
                )}
              </div>
            )}
          </ListDataEditor>
        )}
      </CardCollapse>

      {showAppointmentSection && (
        <CardCollapse title={"วันที่นัดหมายปฏิบัติงาน"}>
          <div className="px-2 -mt-3">
              <InputDateButton
                label="วันที่นัดหมายปฏิบัติงาน"
                value={appointmentDate}
                onChange={handleDateChange}
                placeholder="เลือกวันที่นัดหมายปฏิบัติงาน"
                className="w-full md:w-[15%]"
              />
          </div>
        </CardCollapse>
      )}

      {/* Add Or Update Worker Modal */}
      {!isReadOnly && (
        <AddWorker
          open={openModal}
          onClose={() => setOpenModal(false)}
          onAddWorker={handleAddWorker}
          onUpdateWorker={handleUpdateWorker}
          groupWorkerOptions={groupWorkerOptions}
          workerOptions={workerOptions}
          eventOptions={eventOptions}
          workCenterOptions={workCenterOptions}
          onUpdateEventOptions={setEventOptions}
          onUpdateWorkCenterOptions={setMainWorkCenterOptions}
          editData={editData}
        />
      )}
    </div>
  );
};

export default WorkerList;
