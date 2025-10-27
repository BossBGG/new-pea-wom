import {getMainWorkCenterOptions} from "@/app/api/WorkOrderApi";
import {Options} from "@/types";

const handleSearchMainWorkCenter = async (search: string = "") => {
  try {
    const res = await getMainWorkCenterOptions(search)
    if(res.status === 200 && res.data.data) {
      let options: Options[] = []
      res.data.data.map(d => {
        options.push({ value: d.Arbpl, label: d.Ktext, data: d })
      })
      return options;
    }
    return []
  }catch (e) {
    console.error(e)
    return []
  }
}

export default handleSearchMainWorkCenter;
