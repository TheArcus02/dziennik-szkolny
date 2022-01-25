import { StudentsDataFromFirebase } from "../../../utils/interfaces"
import { SingleClassTableRow } from "./SingleClassTableRow"

interface SingleClassTableProps {
    studentsInfo: StudentsDataFromFirebase
}

export const SingleClassTable: React.FC<SingleClassTableProps> = ({ studentsInfo }) => {
    const students = Object.values(studentsInfo)

    return (
        <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
                <thead>
                    <tr>
                        <th>Nr</th> 
                        <th>Nazwisko</th> 
                        <th>Imię</th> 
                        <th>Email</th> 
                        <th>Urodziny</th>
                        <th>Pesel</th>
                        <th>Ostatnie logowanie</th>
                        <th>Więcej</th>
                    </tr>
                </thead> 
                <tbody>
                    {students.map((student, index) => (
                        <SingleClassTableRow key={student.email} student={student} number={index + 1} />
                    ))}
                </tbody>
            </table>
        </div>

    )
}