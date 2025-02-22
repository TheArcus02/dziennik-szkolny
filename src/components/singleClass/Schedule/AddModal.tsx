import moment from "moment";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useValidateInputs } from "../../../hooks/useValidateInputs";
import { scheduleItem } from "../../../utils/interfaces";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { toast } from "react-toastify";
import { isEqual } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

type selectOption = { value: string; label: string };

interface addModalItf {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userEmail: string;
  add: (data: any, oldItem?: any) => void;
  event?: scheduleItem;
  reciever: string[];
  selectItems: selectOption[];
}

export const AddModal: React.FC<addModalItf> = ({
  isOpen,
  setIsOpen,
  userEmail,
  add,
  event,
  reciever,
  selectItems,
}) => {
  const userType = useSelector((state: RootState) => state.userType.userType);
  const principal = useSelector((state: RootState) => state.principal);
  const allTeachers = useSelector((state: RootState) => state.schoolData.schoolData?.teachers);
  const initialFormData: Omit<scheduleItem, "isActive"> = {
    name: "",
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
    addedBy: userEmail,
    receiver: reciever,
  };
  const formReset: Omit<scheduleItem, "isActive"> = {
    name: "",
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
    addedBy: userEmail,
    receiver: [""],
  };

  const [formData, setFormData] = useState(
    event
      ? {
          ...event,
          dateFrom: moment(Number(event.dateFrom.replaceAll(/\s/g, ""))).format(
            "yyyy-MM-DD"
          ),
          dateTo: moment(Number(event.dateTo.replaceAll(/\s/g, ""))).format(
            "yyyy-MM-DD"
          ),
        }
      : initialFormData
  );

  const [validated, setValidated] = useState(false);

  const [datesChanged, setDatesChanged] = useState(false);

  const { validateData, inputErrors, errors } = useValidateInputs();
  const animatedComponents = makeAnimated();

  useEffect(() => {
    if (validated) {
      if (errors) {
        setValidated(false);
        return;
      }
      if (event) {
        let eventDatesChanged = {
          ...event,
          dateFrom: moment(Number(event.dateFrom.replaceAll(/\s/g, ""))).format(
            "yyyy-MM-DD"
          ),
          dateTo: moment(Number(event.dateTo.replaceAll(/\s/g, ""))).format(
            "yyyy-MM-DD"
          ),
        };
        if (isEqual(formData, eventDatesChanged)) {
          toast.warning("Żadne dane się nie zmieniły", { autoClose: 2000 });
          setValidated(false);
          return;
        }
      }
      if(userType!=='principals'){
        setFormData((prev) => ({
          ...prev,
          dateFrom: String(Date.parse(prev.dateFrom)),
          dateTo: String(Date.parse(prev.dateTo)),
          addedBy: userEmail,
        }));
      }else{
        if(allTeachers&&principal.data){
          const splittedName = formData.addedBy.split(" ");
          const teacherObj = Object.values(allTeachers).find(x=>x.firstName===splittedName[0]&&x.lastName===splittedName[1])
          teacherObj? setFormData((prev) => ({
            ...prev,
            dateFrom: String(Date.parse(prev.dateFrom)),
            dateTo: String(Date.parse(prev.dateTo)),
            addedBy:teacherObj.email
          })):setFormData((prev) => ({
            ...prev,
            dateFrom: String(Date.parse(prev.dateFrom)),
            dateTo: String(Date.parse(prev.dateTo)),
            addedBy:principal.data?.email as string,
          }))
        }
      }

      setDatesChanged(true);
    }
    setValidated(false);
  }, [validated, errors]);
  useEffect(() => {
    if (datesChanged) {
      if (!event) {
        add(formData);
      } else {
        if (
          userType === "principals" &&
          formData.addedBy !==userEmail&&allTeachers
        ) {
          const splittedName = event.addedBy.split(" ");
          const teacherObj = Object.values(allTeachers).find(x=>x.firstName===splittedName[0]&&x.lastName===splittedName[1])
           teacherObj&&add(formData,{...event,addedBy:teacherObj.email})
        } else {
          add(formData, { ...event, addedBy: userEmail });
        }
      }
      setFormData(formReset);
    }
    setDatesChanged(false);
  }, [datesChanged]);

  const handleChange = (name: string, value: string, checked?: Boolean) => {
    if (name === "global") {
      setFormData((prev) => ({
        ...prev,
        receiver: checked ? ["global"] : [""],
      }));
    } else {
      if (name === "dateFrom") {
        let dateFrom = moment(value);
        let dateTo = moment(formData.dateTo);
        if (dateTo.isBefore(dateFrom)) {
          setFormData((prev) => ({
            ...prev,
            dateTo: value,
          }));
        }
      }
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  function handleSelectChange(currentSelected: any) {
    let selectedInputs = currentSelected.map((val: any) => val.value);
    setFormData((prev) => ({
      ...prev,
      receiver: selectedInputs,
    }));
  }

  const handleSubmit = () => {
    setValidated(false);
    validateData(formData);
    setValidated(true);
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""} `}>
      <div className="modal-box flex flex-col items-center gap-2 bg-base-300">
        <AiOutlineClose
          onClick={() => setIsOpen((prev) => !prev)}
          size={30}
          className="absolute top-2 right-2 cursor-pointer"
        />
        <h2 className="mb-3">
          {event ? "Edytuj wydarzenie" : "Dodaj wydarzenie"}
        </h2>
        <label>Nazwa</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          className={`input ${inputErrors.name.error ? "border-red-500" : ""}`}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <label>Data Rozpoczęcia</label>
        <input
          type="date"
          name="dateFrom"
          value={formData.dateFrom}
          min={new Date().toISOString().split("T")[0]}
          className={`input ${
            inputErrors.dateFrom.error ? "border-red-500" : ""
          }`}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <label>Data Zakończenia</label>
        <input
          type="date"
          name="dateTo"
          value={formData.dateTo}
          min={formData.dateFrom}
          className={`input ${
            inputErrors.dateTo.error ? "border-red-500" : ""
          }`}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <fieldset
          className={`border border-solid  rounded-md p-4 mt-4 ${
            inputErrors.receiver.error ? "border-red-500" : ""
          }`}
        >
          <legend className="text-center font-bold">Odbiorca</legend>
          <div className="flex flex-col items-center">
            {userType === "principals" && (
              <div className="flex items-center">
                <span>Wszyscy</span>
                <input
                  type="checkbox"
                  name="global"
                  id="global"
                  checked={formData.receiver[0] === "global"}
                  onChange={(e) =>
                    handleChange(
                      e.target.name,
                      e.target.value,
                      e.target.checked
                    )
                  }
                  className="checkbox ml-2"
                />
              </div>
            )}
            <Select
              className="my-5 text-neutral-focus"
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={selectItems}
              value={formData.receiver.map((rec) => ({
                value: rec,
                label: rec,
              }))}
              isDisabled={formData.receiver[0] === "global"}
              onChange={handleSelectChange}
            />
          </div>
        </fieldset>
        <button onClick={handleSubmit} className="btn btn-primary w-44 mt-3">
          {event ? "Zmień" : "Dodaj"}
        </button>
      </div>
    </div>
  );
};
