import { Outlet } from 'react-router-dom'

import BackOfficeSideNav from './BackOfficeSideNav'

export default function BackOfficeLayout() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[18rem_1fr]">
      <BackOfficeSideNav />
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
