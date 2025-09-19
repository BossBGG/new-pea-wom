import {getTransformerVoltages} from "@/app/api/WorkOrderApi";
import {Options, TransFormerVoltage} from "@/types";

const getVoltagesOptions = async (reqCode: string) => {
  try {
    const res = await getTransformerVoltages(reqCode);
    if(res.status === 200 && res.data.data) {
      let options: Options[] = []
      res.data.data.map((item: TransFormerVoltage) => {
        options.push({value: item.id, label: item.option_title, data: item});
      })

      return options;
    }
    return []
  }catch (e){
    console.error(e);
    return [];
  }
}

export default getVoltagesOptions;
