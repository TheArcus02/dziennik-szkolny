import { AiFillInfoCircle } from "react-icons/ai";
import { RiBookMarkFill } from "react-icons/ri";
import { GiTeacher } from "react-icons/gi";
import { AiFillCalendar } from "react-icons/ai";
import { CombinedPrincipalData, CombinedSchoolDataFromFirebase } from "../../../utils/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Link } from "react-router-dom";

export const Stats: React.FC = () => {
  const userData = useSelector(
    (state: RootState) => state.principal.data
  ) as CombinedPrincipalData;

  const schoolData = useSelector((state: RootState) => state.schoolData.schoolData as CombinedSchoolDataFromFirebase)
  const userPhoto = useSelector((state: RootState) => state.principal.user?.photoURL)

  const { firstName } = userData;
  const {
    classesCount = 0,
    studentsCount = 0,
    teachersCount = 0,
    planType = "Basic",
  } = schoolData.information;

  return (
    <div className="stats grid-flow-row w-full">
      <div className="stat bg-base-200">
        <div className="stat-figure text-info">
        {userPhoto ? (
                    <div className="avatar online">
                    <div className="w-16 h-16 p-1 mask mask-squircle bg-base-100">
                        <img
                            src={userPhoto}
                            alt="Avatar Tailwind CSS Component"
                            className="mask mask-squircle"
                        />
                    </div>
                    </div>
                ):(
                    <div className="avatar online placeholder flex flex-col justify-center items-center">

                        <div className="text-neutral-content rounded-full w-16 h-16 p-1 mask mask-squircle bg-base-100">

                            <span className="text-3xl">
                            {userData?.firstName[0]}
                            {userData?.lastName[0]}
                            </span>
                        </div>
                    </div>
              )}
        </div>
        <div className="stat-title">Witaj,</div>
        <div className="stat-value">{firstName}</div>
      </div>

      <div className="stat bg-base-200">
        <div className="stat-figure text-primary items-center">
          <AiFillInfoCircle size={35} className="text-primary" />
        </div>
        <div className="stat-title">Liczba klas</div>
        <div className="stat-value">{classesCount}</div>
      </div>

      <div className="stat bg-base-200">
        <div className="stat-figure text-primary items-center">
          <RiBookMarkFill size={35} className="text-primary" />
        </div>
        <div className="stat-title">Liczba uczniów</div>
        <div className="stat-value">{studentsCount}</div>
      </div>

      <div className="stat bg-base-200">
        <div className="stat-figure text-secondary">
          <GiTeacher size={35} className="text-primary" />
        </div>
        <div className="stat-title">Liczba nauczycieli</div>
        <div className="stat-value">{teachersCount}</div>
      </div>
      <div className="stat bg-base-200">
        <div className="stat-figure text-secondary">
          <AiFillCalendar size={35} className="text-primary" />
        </div>
        <div className="stat-title">Aktualny Plan</div>
        <div className="stat-value">{planType}</div>
        <div className="stat-actions">
          <Link to='/settings/plan' className="btn btn-sm btn-primary">Zmień plan</Link>
        </div>
      </div>
    </div>
  );
};
