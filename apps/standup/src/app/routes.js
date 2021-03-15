
import { FrontStandupHome } from '@standup/front/standup/home';

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: FrontStandupHome,
    layout: "/admin",
  }
];

export default dashboardRoutes;
