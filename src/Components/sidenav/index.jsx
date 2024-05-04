import React from "react";
import styles from "./sidenav.module.scss";
import { ImHome } from "react-icons/im";
// import { MdSchool } from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";
// import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaClock } from "react-icons/fa";
// import { PiListNumbersFill } from "react-icons/pi";
import { GrUserAdmin } from "react-icons/gr";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Img152 from '../../Assets/images/newcross152.svg'


function Sidenav() {
  const navigate = useNavigate();
  // const location = useLocation();
  // const user = useSelector((state) => state.user.data.details);


  // console.log(location.path);

  // const { data: { user_data: user } } = useSelector(state => state.user)

  const paths = [
    {
      id: 1,
      name: "Home",
      icon: <ImHome />,
      path: "/admin/home",
    },
    {
      id: 2,
      name: "Reports",
      icon: <FaClock />,
      path: "/admin/reports",
    },
    {
      id: 3,
      name: "Users",
      icon: <GrUserAdmin />,
      path: "/admin/create-users",
    },
    {
      id: 3,
      name: "My Profile",
      icon: <AiFillSetting />,
      path: "/admin/profile",
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
            className="xs:w-[150px] sm:w-[120px] md:w-[150px] lg:w-[150px]"
          />
        </Link>
      </div>
      <div className={styles.barsContainer}>
        {paths.map((x) => {
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
              {x.icon} <span className={styles.barText}>{x.name}</span>
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
