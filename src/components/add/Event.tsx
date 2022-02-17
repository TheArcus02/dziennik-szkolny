import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useValidateInputs } from "../../hooks/useValidateInputs";
import { RootState } from "../../redux/store"
import { scheduleItem, scheduleItemsArray } from "../../utils/interfaces";
import { ScheduleTable } from "../singleClass/Schedule/ScheduleTable";
import Select, { StylesConfig } from 'react-select';
import makeAnimated from 'react-select/animated';
import moment from "moment";
import { useSetDocument } from "../../hooks/useSetDocument";
import { toast } from "react-toastify";



export const Event:React.FC = () => {

    //types
    type selectOption = {value: string, label:string}
    
    // selectors
    const firebaseEvents = useSelector((state: RootState) => state.schoolData.schoolData?.events);
    const domain = useSelector((state: RootState) => state.schoolData.schoolData?.information.domain);
    const classes = useSelector((state: RootState) => state.schoolData.schoolData?.classes)
    const userData = useSelector((state: RootState) => state.principal.data);
    const userType = useSelector((state: RootState) => state.userType.userType)

     // initials
     const initialFormData:scheduleItem = {
        name: '',
        dateFrom: new Date().toISOString().split("T")[0],
        dateTo: new Date().toISOString().split("T")[0],
        addedBy: userData?.email ? userData?.email : '',
        receiver: ['']
    }

    // States
    const [events, setEvents] = useState<scheduleItemsArray>([])
    const [formData, setFormData] = useState(initialFormData)
    const [selectOptions, setSelectOptions] = useState<Array<selectOption>>();
    const [validated, setValidated] = useState<Boolean>(false)

    // Hooks
    const { validateData, inputErrors, errors } = useValidateInputs();
    const { setDocument } = useSetDocument();
    const animatedComponents = makeAnimated();
    

    useEffect(() => {
      if(firebaseEvents){

        let schedulesClasses = Object.values(firebaseEvents.classes).filter((ev) => ev.addedBy === userData?.email);
        let schedulesGlobal = Object.values(firebaseEvents.global).filter((ev) => ev.addedBy === userData?.email);
        
        setEvents([...schedulesClasses, ...schedulesGlobal]);
      }
      if(classes){
          setSelectOptions(Object.keys(classes).map((className) => {
              return {value: className, label: className}
          }))
          
      }
    }, [])

    useEffect(() => {
      if(validated){
        if(errors) return
        console.log(formData);
        if(firebaseEvents){
            if(formData.receiver[0] === 'global'){
                let obj = {'global': [...firebaseEvents?.global, formData]}
                setDocument(domain as string, 'events', obj)
            }else{
                let obj = {'classes': [...firebaseEvents?.classes, formData]}
                setDocument(domain as string, 'events', obj);
            }
        } else{
            toast.error('Brak obiektu wydarzeń')
        }
        
      }
      setValidated(false);
    }, [validated, errors])

    
    
    const handleChange = (name: string, value: string, checked?: Boolean) => {
        if(name === 'global'){
            setFormData((prev) => ({
                ...prev, receiver: checked ? ['global'] : ['']
            }))
        }else{
            if(name === 'dateFrom'){
                let dateFrom = moment(value)
                let dateTo = moment(formData.dateTo)
                if(dateTo.isBefore(dateFrom)){
                    setFormData((prev) => ({
                        ...prev, 'dateTo': value
                    }))
                }
            }
            setFormData((prev) => ({
                ...prev, [name]:value
            }));
        }
        
    }
    function handleSelectChange(currentSelected:any) {
        let selectedInputs = currentSelected.map((val:any) => val.value);
        setFormData((prev) => ({
            ...prev, receiver: selectedInputs
        }))
      }

    const handleEdit = () => {
        
    }
    
    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();
        setValidated(false);
        setFormData((prev) => ({
            ...prev, dateFrom: String(Date.parse(prev.dateFrom)),
            dateTo: String(Date.parse(prev.dateTo))
        }))
        validateData(formData);
        setValidated(true);
    }

    if(!userData || !domain){
        return <div>Brak obiektu użytkownika</div>
    }
    return (
        <div className="flex flex-col items-center">
            <form className="form-control w-96 mt-12 p-10 card bg-base-200">
                <label className="label">
                    <span className="label-text">Nazwa wydarzenia</span>
                </label>
                <input
                    className={`input ${inputErrors.name.error ? "border-red-500" : ""}`}
                    type="text"
                    placeholder="Nazwa wydarzenia"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                <label className="label">
                    <span className="label-text">Data od</span>
                </label>
                <input
                    type="date"
                    name="dateFrom"
                    value={formData.dateFrom}
                    min={new Date().toISOString().split("T")[0]}
                    className={`input ${inputErrors.dateFrom.error ? "border-red-500" : ''}`}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />

                <label className="label">
                    <span className="label-text">Data do</span>
                </label>
                <input
                    type="date"
                    name="dateTo"
                    value={formData.dateTo}
                    min={formData.dateFrom}
                    className={`input ${inputErrors.dateTo.error ? "border-red-500" : ''}`}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                <fieldset
                    className={`border border-solid  rounded-md p-4 mt-4 ${
                    inputErrors.receiver.error
                        ? "border-red-500"
                        : ""
                    }`}
                >
                    <legend className="text-center font-bold">Odbiorca</legend>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center">
                            <span>Wszyscy</span>
                            <input 
                            type="checkbox" 
                            name="global" 
                            id="global" 
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.checked)} 
                            className="checkbox ml-2"
                            />
                        </div>

                        <Select
                            className="my-5 text-neutral-focus"
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={selectOptions}
                            isDisabled={formData.receiver[0] === 'global'}
                            onChange={handleSelectChange}
                        />

                    </div>
                    
                </fieldset>
                
                <div className="flex items-center justify-center w-full">
                    <button
                    className="btn btn-primary mt-4 self-end"
                    onClick={(e) => handleSubmit(e)}
                    >
                    Stwórz
                    </button>
                </div>
            </form>
            <div className="text-2xl text-center my-5 text-primary">Twoje wydarzenia</div>
            <ScheduleTable schedule={events} userEmail={userData.email} userType={userType} edit={handleEdit} />
        
        </div>
    )
}