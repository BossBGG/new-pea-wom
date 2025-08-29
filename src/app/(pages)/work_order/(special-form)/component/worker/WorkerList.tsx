import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";
import {useAppSelector} from "@/app/redux/hook";
import {DataTableEditor} from "@/app/components/editor-table/DataTableEditor";
import {getColumns} from "@/app/(pages)/work_order/(special-form)/component/worker/columns";
import {Options, WorkerObj} from "@/types";
import {useState} from "react";
import InputDateButton from "@/app/components/form/InputDateButton";
import {ListDataEditor} from "@/app/components/editor-table/ListDataEditor";
import WorkerListContent from "@/app/(pages)/work_order/(special-form)/component/worker/WorkerListContent";
import {Button} from "@/components/ui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import AddWorker from "@/app/(pages)/work_order/(special-form)/component/worker/AddWorker";

interface WorkerListProps {
  data: WorkerObj[]
}

const WorkerList = ({
                      data
                    }: WorkerListProps) => {
  const screenSize = useAppSelector(state => state.screen_size);
  const [workers, setWorkers] = useState<WorkerObj[]>(data);
  const [openModal, setOpenModal] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(-1);
  
  // Mock options data - ในความเป็นจริงควรมาจาก API
  const [groupWorkerOptions] = useState<Options[]>([
    {label: 'พนักงาน PEA', value: 'pea_employee'},
    {label: 'ผู้รับเหมา', value: 'contractor'},
    {label: 'ที่ปรึกษา', value: 'consultant'}
  ]);
  
  const [workerOptions] = useState<Options[]>([
    {label: 'นายจิตนพื้นกต่าง องอาจ', value: 'worker_1'},
    {label: 'นายสมชาย ใจดี', value: 'worker_2'},
    {label: 'นางสาวสมหญิง รักงาน', value: 'worker_3'}
  ]);
  
  const [eventOptions] = useState<Options[]>([
    {label: 'กิจกรรม A', value: 'กิจกรรม A'},
    {label: 'กิจกรรม B', value: 'กิจกรรม B'},
    {label: 'กิจกรรม C', value: 'กิจกรรม C'}
  ]);
  
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(undefined);
  
  const itemWorker: WorkerObj = {
    isUpdate: true,
  } as WorkerObj

  const handleDateChange = (date: Date | undefined) => {
    setAppointmentDate(date);
    console.log('Appointment date selected:', date);
  };

  const handleUpdateData = (data: WorkerObj[]) => {
    setWorkers(data);
  };

  const onRemoveData = (id: number) => {
    console.log('Remove worker with id:', id);
  };

  const handleAddWorker = (newWorker: WorkerObj) => {
    setWorkers(prev => [...prev, newWorker]);
  };

  return (
    <div>
      <CardCollapse title={'รายชื่อผู้ปฏิบัติงาน'}>
        {
          screenSize === 'desktop'
            ? <DataTableEditor 
                columns={getColumns(groupWorkerOptions, workerOptions, eventOptions)}
                onUpdateData={handleUpdateData}
                realData={workers}
                onRemoveData={onRemoveData}
                LabelAddRow={'เพิ่มผู้ปฏิบัติงาน'}
                rowItem={itemWorker}
              />
            : <ListDataEditor 
                onUpdateData={handleUpdateData}
                realData={workers}
              >
                {
                  (pageData: WorkerObj[], page, pageSize) =>
                    <div>
                      <WorkerListContent 
                        pageData={pageData}
                        realData={workers}
                        page={page}
                        pageSize={pageSize}
                        onUpdateData={handleUpdateData}
                        groupWorkerOptions={groupWorkerOptions}
                        workerOptions={workerOptions}
                        eventOptions={eventOptions}
                        onRemoveData={onRemoveData}
                        setUpdateIndex={(index) => {
                          setUpdateIndex(index)
                          setOpenModal(true)
                        }}
                      />

                      <Button className="pea-button-outline my-2 w-full"
                              onClick={() => setOpenModal(true)}
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                        เพิ่มผู้ปฏิบัติงาน
                      </Button>
                    </div>
                }
              </ListDataEditor>
        }
      </CardCollapse>

      <CardCollapse title={'วันที่นัดหมายปฏิบัติงาน'}>
        <div className="p-4">
          <div className="flex flex-col space-y-4">
            <InputDateButton
              label="วันที่นัดหมายปฏิบัติงาน"
              value={appointmentDate}
              onChange={handleDateChange}
              placeholder="เลือกวันที่นัดหมายปฏิบัติงาน"
              className="w-full md:w-1/3"
            />
            
            
          </div>
        </div>
      </CardCollapse>

      {/* Add Worker Modal */}
      <AddWorker 
        open={openModal}
        onClose={() => setOpenModal(false)}
        index={updateIndex}
        onAddWorker={handleAddWorker}
        groupWorkerOptions={groupWorkerOptions}
        workerOptions={workerOptions}
        eventOptions={eventOptions}
      />
    </div>
  )
}

export default WorkerList;