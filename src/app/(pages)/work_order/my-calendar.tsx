import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {formatJSDateTH} from "@/app/helpers/DatetimeHelper";
import InputSelect from "@/app/components/form/InputSelect";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {th} from "date-fns/locale";
import {Card} from "@/components/ui/card";
import {useRef, useState} from "react";

const MyCalendar: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [calendarMode, setCalendarMode] = useState<'timeGridDay' | 'timeGridWeek' | 'dayGridMonth' | string>('timeGridDay');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleChangeView = (view: "timeGridDay" | "timeGridWeek" | "dayGridMonth" | string | number) => {
    setCalendarMode(view as string)
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.changeView(view as string)
  }

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.prev()
    setSelectedDate(calendarApi?.getDate())
  }

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.next()
    setSelectedDate(calendarApi?.getDate())
  }

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.today()
    setSelectedDate(calendarApi?.getDate())
  }

  return (
    <Card className="p-4">
      <div className="text-[#160C26] font-semibold my-3">ตารางงานของฉัน</div>
      <div className="flex justify-between items-center -my-2">
        <div className="flex items-center gap-2">
          <button
            className="pea-button-outline !px-3 !py-2 rounded-md"
            onClick={handleToday}
          >
            วันนี้
          </button>

          <button
            className="px-3 py-1 rounded-md cursor-pointer"
            onClick={handlePrev}
          >
            <FontAwesomeIcon icon={faChevronLeft} color="#671FAB"/>
          </button>
          <button
            className="px-3 py-1 rounded-md cursor-pointer"
            onClick={handleNext}
          >
            <FontAwesomeIcon icon={faChevronRight} color="#671FAB"/>
          </button>

          <div>
            {
              selectedDate && formatJSDateTH(selectedDate, 'dd MMMM yyyy')
            }
          </div>
        </div>

        <div className="md:w-40 lg:w-25">
          <InputSelect options={[
            {value: "timeGridDay", label: "วัน"},
            {value: "timeGridWeek", label: "สัปดาห์"},
            {value: "dayGridMonth", label: "เดือน"}
          ]}
                       value={calendarMode}
                       placeholder={""}
                       setData={handleChangeView}
                       className="rounded-full text-[#671FAB] cursor-pointer"
          />
        </div>
      </div>

      <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridDay"
                    nowIndicator={true}
                    allDaySlot={false}
                    themeSystem="bootstrap"
                    headerToolbar={false}
                    dayCellDidMount={(info) => {
                      info.el.style.backgroundColor = 'white'
                    }}
                    slotLabelDidMount={(info) => {
                      info.el.style.fontSize = '14px'
                      info.el.style.fontFamily = 'IBM Plex Sans, sans-serif'
                    }}
                    events={[
                      {title: 'ประชุม', start: new Date()},
                      {title: "Meeting", start: "2025-09-11T10:00:00"},
                      {title: "Workshop", start: "2025-09-15"},
                    ]}
                    slotLabelFormat={{
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    }}
                    ref={calendarRef}
                    locale={th}
      />
    </Card>
  )
}

export default MyCalendar;
