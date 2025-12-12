import {MenuItem} from "@/types";

export const pea_menu: MenuItem[] = [
  {
    name: 'เมนู',
    href: '',
    isTitle: true,
  },
  {
    // name: 'รายการใบสั่งงาน',
    name: 'รายการใบสั่งงานและผลปฏิบัติงาน',
    href: '/work_order',
    icon: 'icon-worksheet',
    key: 'work_order'
  },
  {
    name: 'ภาพรวม',
    href: '/dashboard',
    key: 'dashboard',
    icon: 'icon-home',
  },
  {
    name: 'ประเมินความพึงพอใจในการให้บริการ',
    href: '/service_satisfaction',
    key: 'satisfaction',
    icon: 'icon-satisfaction',
  },
  {
    name: 'ประกาศและข่าว',
    href: '/news',
    key: 'news',
    icon: 'icon-news'
  },
  {
    name: 'ตั้งค่า',
    isTitle: true,
    href: ''
  },
  {
    name: 'แจ้งเตือนทั้งหมด',
    href: '/notifications',
    key: 'notifications',
    icon: 'icon-notification',
  }
]
