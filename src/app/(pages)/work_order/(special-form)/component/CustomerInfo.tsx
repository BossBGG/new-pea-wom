import {useState} from "react";
import InputText from "@/app/components/form/InputText";
import {Customer} from "@/types";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";

interface CustomerInfoProps {
  data: Customer;
  updateData: (value: Customer) => void
}

const CustomerInfo = ({
                        data,
                        updateData
                      }: CustomerInfoProps) => {
  const [customer, setCustomer] = useState<Customer>(data);

  const handleChange = (key: string, value: string) => {
    setCustomer(old => ({...old, [key]: value}));
    updateData(customer)
  }

  return (
    <CardCollapse title={'ข้อมูลลูกค้า'}>
      <div className="flex flex-wrap px-0 py-2 ">
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="ชื่อลูกค้า"
                     label="ชื่อลูกค้า"
                     value={customer.name}
                     onChange={(v) => handleChange('name', v)}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="โทรศัพท์มือถือ"
                     label="โทรศัพท์มือถือ"
                     value={customer.tel}
                     numberOnly={true}
                     maxLength={10}
                     onChange={(v) => handleChange('tel', v)}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="ที่อยู่ขอรับบริการ"
                     label="ที่อยู่ขอรับบริการ"
                     value={customer.address}
                     onChange={(v) => handleChange('address', v)}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="อีเมล"
                     label="อีเมล"
                     value={customer.email}
                     type="email"
                     onChange={(v) => handleChange('email', v)}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="BP"
                     label="BP"
                     value={customer.bp}
                     onChange={(v) => handleChange('bp', v)}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="CA"
                     label="CA"
                     value={customer.ca}
                     onChange={(v) => handleChange('ca', v)}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="Latitude"
                     label="Latitude"
                     value={customer.latitude}
                     onChange={(v) => handleChange('latitude', v)}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="Longitude"
                     label="Longitude"
                     value={customer.longitude}
                     onChange={(v) => handleChange('longitude', v)}
          />
        </div>
      </div>
    </CardCollapse>
  )
}

export default CustomerInfo;
