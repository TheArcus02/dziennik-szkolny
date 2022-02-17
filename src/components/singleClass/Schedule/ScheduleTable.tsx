import moment from "moment";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { scheduleItemsArray, userType } from "../../../utils/interfaces";
import { AddModal } from "./AddModal";

interface ScheduleTableItf {
  schedule: scheduleItemsArray;
  userEmail: string;
  userType: userType | undefined;
  edit: (data: any, oldItem: any) => void;
}
export const ScheduleTable: React.FC<ScheduleTableItf> = ({
  schedule,
  userEmail,
  userType,
  edit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventEdit, setEventEdit] = useState({
    event: {
      name: "",
      dateFrom: "",
      dateTo: "",
      addedBy: "",
      receiver: ['']
    },
    edit: isOpen,
  });

  useEffect(() => {
    setEventEdit((prev) => ({
      ...prev,
      edit: isOpen,
    }));
  }, [isOpen]);

  return (
    <table className="table w-full table-zebra">
      <thead>
        <tr>
          <th>Nazwa wydarzenia</th>
          <th>Data rozpoczęcia</th>
          <th>Data zakończenia</th>
          <th>Dodał</th>
          <th className="w-1"></th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((item, index) => (
            <tr key={item.name+index}>
              <td>{item.name}</td>
              <td>
                {moment(Number(item.dateFrom.replaceAll(/\s/g, ""))).format(
                  "DD.MM.yyyy"
                )}
              </td>
              <td>
                {moment(Number(item.dateTo.replaceAll(/\s/g, ""))).format(
                  "DD.MM.yyyy"
                )}
              </td>
              <td>{item.addedBy}</td>
              <td>
                {(userType === "principals" || item.addedBy === userEmail) && (
                  <>
                    <AddModal
                      key={item.name + index}
                      isOpen={eventEdit.edit && eventEdit.event === item}
                      setIsOpen={setIsOpen}
                      userEmail={userEmail}
                      add={edit}
                      event={item}
                      reciever={item.receiver}
                    />
                    <button
                      className="btn btn-square btn-warning btn-sm"
                      onClick={() => {
                        setIsOpen((prev) => !prev);
                        setEventEdit((prev) => ({ ...prev, event: item }));
                      }}
                    >
                      <FaUserEdit size={20} />
                    </button>
                    <button className="btn btn-square btn-error btn-sm ml-2">
                      <AiFillDelete size={20} />
                    </button>
                  </>
                )}
              </td>
            </tr>
        ))}
      </tbody>
    </table>
  );
};
