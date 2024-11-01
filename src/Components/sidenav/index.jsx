import React, { useMemo } from "react";
import styles from "./sidenav.module.scss";
import { GrGroup } from "react-icons/gr";
import { useNavigate, useLocation } from "react-router";
import { Link } from "react-router-dom";
// import Img152 from '../../Assets/images/newcross152.svg'
// import { useSelector } from "react-redux";

import { images } from "Assets";
import Text from "Components/Text";
import { Bubble, Edit, FolderOpen, Home, User, People, Lock, Book, Driver, Setting2 } from 'iconsax-react';
import newLogoo from 'Assets/images/radaNewLogoo.svg'
// import { ROLES } from "./roles.ts";


function Sidenav() {
  const navigate = useNavigate();
  const { pathname } = useLocation()
  // const user = useSelector(state => state?.auth?.user)
  const sidebar = useMemo(() => {
    const paths_ = pathname.split("/")
    // console.log(paths_)
    return { module: paths_[1], parent: paths_[2], child: paths_[3]?.toLowerCase() }
  }, [pathname])
  const paths = useMemo(() => ({
    admin: [
      {
        name: "Users",
        icon: <User variant={sidebar.parent === "users" ? "Bold" : "Linear"} />,
        path: "/admin/users",
      },
      {
        name: "Groups",
        icon: <People variant={sidebar.parent === "groups" ? "Bold" : "Linear"} />,
        path: "/admin/groups",
      },
      {
        name: "Roles and Permissions",
        icon: <Lock variant={sidebar.parent === "roles-and-permissions" ? "Bold" : "Linear"} />,
        path: "/admin/roles-and-permissions",
      },
      {
        name: "Manage Assets",
        icon: <Driver variant={sidebar.parent === "manage-assets" ? "Bold" : "Linear"} />,
        path: "/admin/manage-assets",
      },
      {
        name: "Activity Log",
        icon: <Book variant={sidebar.parent === "activity-log" ? "Bold" : "Linear"} />,
        path: "/admin/activity-log",
      }
    ],
    users: [

      {
        name: "Dashboard",
        icon: <Home variant={sidebar.parent === "dashboard" ? "Bold" : "Linear"} />,
        path: "/users/dashboard",
      },
      {
        name: "Field Data Capture",
        icon: <Edit variant={sidebar.parent === "fdc" ? "Bold" : "Linear"} />,
        path: "/users/fdc/daily",
        children: [
          {
            name: "Daily Production/Operations Report ",
            icon: <GrGroup />,
            path: "/users/fdc/daily",
          },
          {
            name: "MER Data",
            icon: <GrGroup />,
            path: "/users/fdc/mer-data",
          },
          {
            name: "Well Test Data",
            icon: <GrGroup />,
            path: "/users/fdc/well-test-data",
          },
          {
            name: "FG/SG Survey Data",
            icon: <GrGroup />,
            path: "/users/fdc/survey-data",
          },
        ]
      },
      {
        name: "Reports",
        icon: <FolderOpen variant={sidebar.parent === "reports" ? "Bold" : "Linear"} />,
        path: "/users/reports",
      },
      {
        name: "Database",
        icon: <Bubble variant={sidebar.parent === "database" ? "Bold" : "Linear"} />,
        path: "/users/database",
      },
      {
        name: "Settings",
        icon: <Setting2 variant={sidebar.parent === "settings" ? "Bold" : "Linear"} />,
        path: "/users/settings",
      },

    ]
  }), [sidebar.parent]);


  return (
    <div className={styles.body}>
      <div className={styles.sidebarHeader}>
        <Link className="flex items-center" href="/lasg-eb-admin">
          <img
            src={newLogoo}
            alt={"logo"}
            width={"150px"}
            height={"150px"}
            className="xs:w-[100px] sm:w-[120px] md:w-[100px] lg:w-[70px]"
          />
          <Text  weight={700} size={'16px'} >RADA AMS</Text>
        </Link>
        {/* <div className={styles.lowerBorder}>
        </div> */}
         {/* <Text weight={700} size={'12px'} >ASSET MANAGEMENT SOLUTION</Text> */}
      </div>
      
      <div className={styles.barsContainer}>
        {paths[sidebar.module].map((x) => {
          return (
            <>
              <div
                className={
                  styles.bars +
                  " " +
                  (x.path.includes(sidebar.parent)
                    ? styles.barSelected
                    : styles.barUnSelected)
                }
                key={x.id}
                onClick={() => navigate(x.path)}
              >
                <span style={{ fontSize: '20px', display: 'block', paddingRight: '15px', }}> {x.icon} </span>
                <Text weight={600} className={styles.barText}>{x.name} </Text>
              </div>
              {
                x?.children?.length && x.path.includes(sidebar.parent)
                &&
                <div className={styles.children}>
                  {x?.children?.map(child => (
                    <div onClick={() => navigate(child.path)} className={`${styles.child} ${child?.path?.includes(sidebar.child) ? styles.child_selected : ""} `}>
                      {child?.name}
                    </div>
                  ))}
                </div>
              }
            </>
          );
        })}
      </div>
    </div>
  );
}

export default Sidenav;
