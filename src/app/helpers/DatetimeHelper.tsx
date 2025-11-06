import { DateTime } from "luxon"

export const formatJSDateTH = (date: Date, format: string = 'yyyy-MM-dd HH:mm:ss') => {
  const d = DateTime.fromJSDate(date).setLocale('th')
  return d.toFormat(parseYearTh(d,format))
}

export const formatJSDate = (date: Date, format: string = 'yyyy-MM-dd HH:mm:ss') => {
  const d = DateTime.fromJSDate(date)
  return d.toFormat(format)
}

export const formatDateTime = (date: string, format: string = 'dd MMM yyyy HH:mm')=> {
  if (!!date) {
    const d = DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss').setLocale('th')
    return d.setLocale('th').toFormat(parseYearTh(d,format))
  }
}

export const parseYearTh = (date: DateTime, format: string): string => {
  if(!!date) {
    const yearTh = date.year + 543
    return format.replace(/y{1,4}/, yearTh.toString())
  }
  return format
}

export const formatDateNewsRange = (date_start: string, date_end: string) => {
  // const start = date_start ? DateTime.fromISO(date_start).toFormat('d') : ''
  const start = date_start ? formatJSDateTH(new Date(date_start), 'dd MMM yyyy') : ''
  const end = date_end ? formatJSDateTH(new Date(date_end), 'dd MMM yyyy') : ''
  return `${start} - ${end}`
}
