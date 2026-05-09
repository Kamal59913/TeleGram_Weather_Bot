import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useModalData } from "../../../redux/hooks/useModal";
import { ToastService } from "../../../utils/toastService";
import { formatDate } from "../../../utils/formateDate";
import { ActionIcons } from "../../action/action";
import schoolService from "../../../api/services/schoolsService";
import { useNavigate } from "react-router-dom";
import { AddAdmin } from "../../../icons";
import Tooltip from "../../ui/tooltip/tooltip";
import { useGetSchools } from "../../../hooks/queries/schools/useSchools";
interface SchoolsTableProps {
  title: string;
}
const SchoolsTable: React.FC<SchoolsTableProps> = () => {
  const { data: localData, isPending } = useGetSchools();

  const { open, close } = useModalData();
  const navigate = useNavigate();


  const deleteSchool = async (_id: string) => {
    const response = await schoolService.deleteSchoolById(_id)
    if (response.success) {
      ToastService.success(`${response.message || 'School Deleted Successfully'}`, 'delete-school')
      close()
    } else {
      ToastService.success(`${response.message || 'Failed Deleting School'}`, 'delete-school-fail')
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                No.
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Email
              </TableCell>


              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Website
              </TableCell>

              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Address
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Registration Number
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Established Year
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Phone
              </TableCell>


              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Created At
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Updated At
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {
              !isPending && !localData?.schools?.length &&
              <TableRow>
                <td className="text-center px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400" colSpan={11}>
                  No Data
                </td>
              </TableRow>
            }
            {localData?.schools?.map((school: any, index: number) => (
              <TableRow key={school._id}>
                <TableCell className="pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {school.name || 'NA'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {school.email || 'NA'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {school.website || 'NA'}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {school.address || 'NA'}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {school.registrationNumber || 'NA'}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {school.establishedYear || 'NA'}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {school.phone || 'NA'}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatDate(school.createdAt, { format: 'date' }) || 'NA'}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatDate(school.updatedAt, { format: 'date' }) || 'NA'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2">
                    <Tooltip text={"Add School Admin"}>
                      <AddAdmin className="dark:text-white text-gray-dark cursor-pointer hover:text-primary dark:hover:text-primary"
                        onClick={() => navigate(`/school-admins-management/add-school-admin?id=${school.id}`)} 
                      />
                    </Tooltip>

                    <ActionIcons onEdit={() =>
                      navigate(`edit-school/${school.id}`)}
                      onDelete={() => {
                        open('delete-action', {
                          title: 'Are you sure want to delete this school?',
                          action: () => {
                            deleteSchool(school?.id)
                          }
                        })
                      }}
                      title="School"
                    />

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SchoolsTable;
