import {getWorkerOptions} from "@/app/api/WorkOrderApi";
import {Options} from "@/types";

export const getWorkerListOptions = async (search: string = "") => {
  try {
    const res = await getWorkerOptions(search)
    if(res.status === 200 && res.data.data) {
      let options: Options[] = []
      res.data.data.map((item) => {
        options.push({ value: item.username, label: `${item.username} - ${item.firstName} ${item.lastName}`, data: item })
      })
      return options;
    }
    return []
  }catch (error) {
    console.error(error)
    return []
  }
}
