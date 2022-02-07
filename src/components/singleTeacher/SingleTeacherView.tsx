import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "../../loader/Loader";
import { RootState } from "../../redux/store";
import {
  genderType,
  SingleClassData,
  SingleTeacherData,
  TeachersDataFromFirebase,
} from "../../utils/interfaces";

// react icons
import { HiOutlineMail } from "react-icons/hi";
import { CgGenderMale, CgGenderFemale } from "react-icons/cg";
import { GiTeacher } from "react-icons/gi";
import { useSetDocument } from "../../hooks/useSetDocument";

export const SingleTeacherView = () => {
  const { email } = useParams();
  const { setDocument } = useSetDocument();

  const [teacher, setTeacher] = useState<SingleTeacherData>();

  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState<SingleTeacherData>();
  const [freeClasses, setFreeClasses] = useState<SingleClassData[]>();

  const userAuth = useSelector((state: RootState) => state.principal.user);

  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );

  const domain = userAuth?.displayName?.split('~')[0];
  const genders: genderType[] = ["Kobieta", "Mężczyzna", "Inna"];



  useEffect(() => {
    const queryEmail = `${email}@${domain}`;

    if(schoolData){
      setFreeClasses(Object.values(schoolData?.classes).filter((cls) => cls.classTeacher.length === 0));
    }
    //!State Ucznia
    setTeacher(schoolData?.teachers[queryEmail]);
    // eslint-disable-next-line
  }, [email, schoolData?.classes, schoolData?.teachers]);

  useEffect(() => {
    if (teacher) {
      setFormData(teacher);
    }
  }, [teacher]);

  const handleChange = (name: string, value: string) => {
    if (teacher) {
      setFormData((prev: any) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  // TODO
  // ? 2. error handeling (red inputs)

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!userAuth) {
      return toast.error("Brak obiektu auth lub typu użytkownika", {
        autoClose: 2000,
      });
    }
    if (formData === teacher)
      return toast.error("Żadne dane się nie zmieniły", { autoClose: 2000 });
    if (formData && teacher && schoolData) {
      
      if (formData.firstName.length === 0 || formData.lastName.length === 0)
        return toast.error("Podaj Imię i Nazwisko", { autoClose: 2000 });

      
      
      const domain = userAuth.displayName?.split("~")[0];

      if(formData.classTeacher !== teacher.classTeacher){
        if(formData.classTeacher.length === 0){
          let tempClassData = {
            [teacher.classTeacher]:{
              classTeacher: ''
            }
          }
          setDocument(domain as string, "classes", tempClassData);
         }else{
          let tempClassData = {
            [formData.classTeacher]:{
              classTeacher: formData.email
            }
          }
          setDocument(domain as string, "classes", tempClassData);
         }
      }
      if(formData.subject !== teacher.subject){
        const formSbjName = formData.subject.replaceAll(/\s+/g, "");
        const teacherSbjName = teacher.subject.replaceAll(/\s+/g, "");
        const formSbjTeachers = schoolData.subjects[formSbjName].teachers;
        const teacherSbjTeachers = schoolData.subjects[teacherSbjName].teachers;
        const teacherSbjWithoutTeacher = teacherSbjTeachers.filter((tch) => tch !== formData.email);
        
        let tempSbjData = {
          [teacherSbjName]:{
            teachers: teacherSbjWithoutTeacher
          },
          [formSbjName]: {
            teachers: [...formSbjTeachers, formData.email]
          }
        }
        setDocument(domain as string, "subjects", tempSbjData);

      }
      let tempData: TeachersDataFromFirebase = {
        [teacher.email]: {
          ...(teacher as SingleTeacherData),
          ...formData,
        },
      };
      console.log({formData});
      setDocument(domain as string, "teachers", tempData);
      setEdit(!edit);
      return toast.success("Dane zapisane poprawnie.", { autoClose: 2000 });
    }
  };

  if (!teacher || !schoolData) return <div>Nie znaleziono nauczyciela lub brak danych o szkole</div>;
  if (!formData) return <Loader />;
  return (
    <div className="h-full m-4">
      <div className="flex justify-center">
        <div className="max-w-screen-2xl w-full rounded-box md:border bg-base-200">
          <div className="flex flex-col justify-center items-center p-10">
            <div className="avatar placeholder flex flex-col justify-center items-center">
              {/* With placeholder */}
              <div className="bg-neutral-focus text-neutral-content rounded-full w-32 h-32 mb-8">
                <span className="text-3xl">
                  {teacher?.firstName[0]}
                  {teacher?.lastName[0]}
                </span>
              </div>
              {/* without placeholder */}
              {/* <div className="avatar flex flex-col justify-center items-center">
                <div className="mb-8 rounded-full w-32 h-32">
                  <img src="https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                  alt="Avatar Tailwind CSS Component"
                  />
                </div>
              </div> */}

              <div className="text-xl flex flex-col justify-center items-center">
                <span>
                  {teacher?.firstName + " "} {teacher?.lastName}
                </span>
                <Link to={`/class/${teacher?.classTeacher}/info`} className="mt-2">
                  <span className="text-accent">{teacher?.classTeacher}</span>{" "}
                </Link>
              </div>
              <div className="pt-5">
                <button className="btn btn-info m-2" onClick={() => undefined}>
                  Wiadomość
                </button>
                  <button
                    className={`btn ${
                      !edit ? "btn-warning" : "btn-error"
                    } m-2 transition duration-200`}
                    onClick={() => setEdit(!edit)}
                  >
                    {!edit ? "Edytuj" : "Anuluj"}
                  </button>

              </div>
            </div>
          </div>

          <div className="bg-base-300 rounded-b-2xl">
            {!edit ? (
              <div className="p-10 flex flex-col h-full items-center justify-evenly">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="flex items-center text-xl p-5">
                    <HiOutlineMail className="mr-2 text-primary" />
                    {teacher?.email}
                  </div>
                  <div className="flex items-center text-xl p-5">
                    <GiTeacher className="mr-2 text-primary" />
                    {teacher?.subject}
                  </div>
                  <div className="flex items-center text-xl p-5">
                    {teacher?.gender !== "Kobieta" ? (
                      <CgGenderMale className="mr-2 text-primary" />
                    ) : (
                      <CgGenderFemale className="mr-2 text-primary" />
                    )}
                    {teacher?.gender}
                  </div>
                </div>
              </div>
            ) : (
              <form className="form-control p-10">
                <span className="card-title">Edycja Nauczyciela</span>
                <div className="divider" />
                <div className="form-control grid grid-cols-1 md:grid-cols-2">
                  <label className="label w-full">
                    <span className="label-text w-full">Imię</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    className="input max-w-96"
                    placeholder="Imię"
                  />

                  <div className="divider md:col-span-2" />

                  <label className="label w-full">
                    <span className="label-text w-full">Nazwisko</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    className="input max-w-96"
                    placeholder="Nazwisko"
                  />

                  <div className="divider md:col-span-2" />
                  
                  <label className="label w-full">
                    <span className="label-text w-full">Wychowawca</span>
                  </label>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    name="classTeacher"
                    value={formData.classTeacher}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  >
                    {teacher.classTeacher.length !== 0 &&
                      <option value={teacher.classTeacher}>
                        {teacher.classTeacher}
                      </option>  
                    }

                    <option value="">
                        brak
                    </option>
                    {freeClasses && 
                    freeClasses.map((cls) => (
                      <option key={cls.fullName} value={cls.name}>
                        {cls.fullName}
                      </option>
                    ))}
                    
                  </select>

                  <div className="divider md:col-span-2" />
                  
                  <label className="label w-full">
                    <span className="label-text w-full">Przedmiot</span>
                  </label>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  >
                    {Object.values(schoolData.subjects).map((sbj) => (
                      <option key={sbj.name} value={sbj.name}>
                        {sbj.name}
                      </option>
                    ))}
                    
                  </select>

                  <div className="divider md:col-span-2" />

                  <label className="label">
                    <span className="label-text">Płeć</span>
                  </label>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    name="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  >
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>

                  <div className="divider md:col-span-2" />

                  <div className="md:col-span-2 flex items-center justify-center mt-10">
                    <button
                      className="btn-primary btn mt-4 self-end"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Zapisz
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
