import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useModalData } from "../../../redux/hooks/useModal";
import { ToastService } from "../../../utils/toastService";
import { useNavigate } from "react-router-dom";
import { ActionIcons } from "../../action/action";
import { formatDate } from "../../../utils/formateDate";
import teachersService from "../../../api/services/teachersService";
import { useGetTeachers } from "../../../hooks/queries/teachers/useTeachers";
import Tooltip from "../../ui/tooltip/tooltip";
interface ClassTableProps {
  title: string;
}
const TeacherTable: React.FC<ClassTableProps> = () => {
  const { data: localData, isPending } = useGetTeachers();

  const { open, close } = useModalData();
  const navigate = useNavigate();

  const deleteTeacher = async (_id: string) => {
    const response = await teachersService.deleteTeacherById(_id)
    if (response.success) {
      ToastService.success(`${response.message || 'Teacher Deleted Successfully'}`, 'delete-teacher')
      close()
    } else {
      ToastService.success(`${response.message || 'Failed Deleting Teacher'}`, 'delete-teacher-fail')
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
                Department
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Subjects
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
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {
              !isPending && !localData?.data?.length &&
              <TableRow>
                <td className="text-center px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400" colSpan={5}>
                  No Data
                </td>
              </TableRow>
            }
            {localData?.data?.map((data: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {data.name || 'NA'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {data.department || 'NA'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Tooltip text={(data.subjects || []).map((s: string) => s.trim()).join(', ') || 'NA'}>
                    {(data.subjects || []).length > 0
                      ? (data.subjects as string[])
                        .map((s) => s.trim())
                        .join(', ')
                      : 'NA'}
                  </Tooltip>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatDate(data.createdAt, { format: 'date' }) || 'NA'}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <ActionIcons onEdit={() => navigate(`edit-school-teacher/${data.id}`)} onDelete={() => {
                    open('delete-action', {
                      title: 'Are you sure want to delete this Section?',
                      action: () => {
                        deleteTeacher(data?.id)
                      }
                    })
                  }}
                    title="Section" />
                </TableCell>
              </TableRow>
            )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeacherTable;
