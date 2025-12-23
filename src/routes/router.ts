

import express from 'express';
import userRoutes from '../modules/users/user.route'
import travelPlanRoute from '../modules/travelPlans/travelPlan.route'
import reviewRoute from '../modules/reviews/review.routes'
import paymentRoute from '../modules/payments/payment.route'
import userDashboardRoutes from '../modules/dashboard/userDashboard.routes'

import authRoutes from '../modules/auth/auth.routes';
const router = express.Router();


// app.use("/api/users", userRoutes);
// app.use("/api/travel-plans", travelPlanRoute);
// app.use("/api/reviews", reviewRoute);
// app.use("/api/payments", paymentRoute);
// app.use("/api/dashboard", userDashboardRoutes);
const apiRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/travel-plans',
    route: travelPlanRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
    {
        path: '/payments',
        route: paymentRoute,
    },
    {   
        path: '/dashboard',
        route: userDashboardRoutes,
    },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
