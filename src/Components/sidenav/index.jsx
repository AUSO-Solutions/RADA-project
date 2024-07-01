import React, { useMemo } from "react";
import styles from "./sidenav.module.scss";
// import { ImHome } from "react-icons/im";
// import { MdSchool } from "react-icons/md";
// import { AiFillSetting } from "react-icons/ai";
// import { IoMdCheckmarkCircleOutline } from "react-icons/io";
// import { FaClock } from "react-icons/fa";
// import { PiListNumbersFill } from "react-icons/pi";
import { GrGroup, GrUserAdmin } from "react-icons/gr";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Img152 from '../../Assets/images/newcross152.svg'
import { useSelector } from "react-redux";
import { GrNotes } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";
// import { ROLES } from "./roles.ts";


function Sidenav() {
  const navigate = useNavigate();
  const user = useSelector(state => state?.auth?.user)

  // const roles_list = ROLES
  const roles = useMemo(() => {
    // return (user?.data?.roles)
  }, [user])



  const paths = [
    // {
    //   id: 1,
    //   name: "Home",
    //   icon: <ImHome />,
    //   path: "/admin/home",
    //   users: ['ALL']

    // },
    // {
    //   id: 2,
    //   name: "Reports",
    //   icon: <FaClock />,
    //   path: "/admin/reports",
    //   users: ['ALL']
    // },
    {
      id: 3,
      name: "Users",
      icon: <FaRegUser />,
      path: "/admin/users",
      users: ['ALL']
    },
    // {
    //   id: 4,
    //   name: "My Profile",
    //   icon: <AiFillSetting />,
    //   path: "/profile",
    //   users: ['ALL']
    // },

    {
      id: 3,
      name: "Groups",
      icon: <GrGroup />,
      path: "/admin/groups",
      users: ['ALL']
    },

    {
      id: 4,
      name: "Roles and Permissions",
      icon: <GrUserAdmin />,
      path: "/admin/roles-and-permissions",
      users: ['ALL']
    },

    {
      id: 5,
      name: "Manage Assets",
      icon: <GrUserAdmin />,
      path: "/admin/manage-assets",
      users: ['ALL']
    },

    {
      id: 6,
      name: "Activity Log",
      icon: <GrNotes />,
      path: "/admin/activity-log",
      users: ['ALL']
    },
  ];


  // {
  //   id: 3,
  //   name: "Reconciliation",
  //   icon: <IoMdCheckmarkCircleOutline />,
  //   path: "/lseb-admin/reconciliation",
  // },


  return (
    <div className={styles.body}>
      <div className={styles.sidebarHeader}>
        <Link href="/lasg-eb-admin">
          <img
            src={Img152}
            alt={"logo"}
            width={"150px"}
            height={"150px"}
            className="xs:w-[100px] sm:w-[120px] md:w-[100px] lg:w-[100px]"
          />
        </Link>
      </div>
      <div className={styles.barsContainer}>
        {paths.filter(path => path.users.includes(roles?.[0]) || path.users[0] === 'ALL').map((x) => {
          return (
            <div
              className={
                styles.bars +
                " " +
                (window.location.pathname === x.path
                  ? styles.barSelected
                  : styles.barUnSelected)
              }
              key={x.id}
              onClick={() => navigate(x.path)}
            >
              <span style={{ fontSize: '20px', display: 'block', paddingRight: '15px' }}> {x.icon} </span> <span className={styles.barText}>{x.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // < div className = { styles.body } >
  //     <div className={styles.sidebarHeader}>
  //         <Image src={asset.svgs.qaLogo} alt={'logo'} />
  //     </div>
  //     <div className={styles.barsContainer}>
  //         {paths.map(x => {
  //             return (
  //                 <div className={styles.bars + " " + (pathname === x.path ? styles.barSelected : styles.barUnSelected)} onClick={() => push(x.path)}>
  //                     {x.icon} <span className={styles.barText}>{x.name}</span>
  //                 </div>
  //             )
  //         })}
  //     </div>
  // </ >
}

export default Sidenav;
