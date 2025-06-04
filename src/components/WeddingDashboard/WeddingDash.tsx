import { Link } from "react-router-dom";
import styles from "./WeddingDashboard.module.css";

// Components
import BudgetOverview from "./Overviews/Budget/BudgetOverview";
import GuestListOverview from "./Overviews/GuestList/GuestListOverview";
import VendorOverview from "./Overviews/Vendors/VendorsOverview";
import TDLOverview from "./Overviews/TDL/TDLOverview";
import SeatOverview from "./Overviews/SeatOverview/SeatOverview";
import DetailsOverview from "./Overviews/Details/DetailsOverview"
import CalendarOverview from "./Overviews/Calendar/CalendarOverview";

export default function WeddingDashboard() {

  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.budget}`}>
          Budget Overview
          <hr className={styles.divider} />
          <BudgetOverview/>
          <Link to="/budget">
            <div className={styles.manageLink}>Manage Budget</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.guests}`}>
          Guests List
          <hr className={styles.divider} />
          <GuestListOverview/>
          <Link to="/guests">
            <div className={styles.manageLink}>Manage Guests</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.seating}`}>
          Seating Chart
          <hr className={styles.divider} />
          <SeatOverview/>
          <Link to="/seating">
            <div className={styles.manageLink}>Manage Seats</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.calendar}`}>
          Calendar
          <hr className={styles.divider} />
          <CalendarOverview />
          <Link to="/calendar">
            <div className={styles.manageLink}>Manage Calendar</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.menu}`}>
          Menu
          <hr className={styles.divider} />
          <Link to="/menu">
            <div className={styles.manageLink}>Manage Menu</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.todo}`}>
          To-Do List
          <hr className={styles.divider} />
          <TDLOverview />
          <Link to="/todolist">
            <div className={styles.manageLink}>Manage TDL</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.vendors}`}>
          Vendors
          <hr className={styles.divider} />
          <VendorOverview />
          <Link to="/myVendors">
            <div className={styles.manageLink}>Manage Vendors</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.detailsMatter}`}>
          Details matter
          <hr className={styles.divider} />
          <DetailsOverview />
          <Link to="/details-matter">
            <div className={styles.manageLink}>Manage Details</div>
          </Link>
        </div>


        <div className={`${styles.card} ${styles.invitation}`}>
          Invitation
          <hr className={styles.divider} />
          <Link to="/invitation">
            <div className={styles.manageLink}>Manage Invitation</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
