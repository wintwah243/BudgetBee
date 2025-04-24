import {
    LayoutDashboard,
    PiggyBank,
    CreditCard,
    User2,
    LogOut,
    Target
  } from "lucide-react";
  
  export const SIDE_MENU_DATA = [
    {
      id: "01",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard"
    },
    {
      id: "02",
      label: "Income",
      icon: PiggyBank,
      path: "/income"
    },
    {
      id: "03",
      label: "Expense",
      icon: CreditCard,
      path: "/expense"
    },
    {
      id: "04",
      label: "Account Info",
      icon: User2,
      path: "/userinfo"
    },
      {
      id: "05",
      label: "All transactions", 
      icon: Target, 
      path: "/all-transactions"
    },
    {
      id: "06",
      label: "Logout",
      icon: LogOut,
      path: "logout"
    }
  ];
  
