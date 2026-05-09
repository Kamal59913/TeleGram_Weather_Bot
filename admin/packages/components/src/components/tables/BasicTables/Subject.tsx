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
import { useGetSubjects } from "../../../hooks/queries/subject/useSubjects";
import Badge from "../../ui/badge/Badge";
import subjectService from "../../../api/services/subjectService";
interface ClassTableProps {
  title: string;
}
const   SubjectTable: React.FC<ClassTableProps> = () => {
  const { data: localData, isPending } = useGetSubjects();

  const { open, close } = useModalData();
  const navigate = useNavigate();
  const deleteSubject = async (_id: string) => {
    const response = await subjectService.deleteSubjectById(_id)
    if (response.success) {
      ToastService.success(`${response.message || 'Subject Deleted Successfully'}`, 'delete-subject')
      close()
    } else {
      ToastService.success(`${response.message || 'Failed Deleting Subject'}`, 'delete-subject-fail')
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
                Code
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Elective
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
                <td className="text-center px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400" colSpan={6}>
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
                  {data.code || 'NA'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      data.isElective === true
                        ? "success" : "error"
                    }
                  >
                    {data.isElective ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatDate(data.createdAt, { format: 'date' }) || 'NA'}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <ActionIcons onEdit={() => navigate(`edit-subject/${data.id}`)} onDelete={() => {
                    open('delete-action', {
                      title: 'Are you sure want to delete this Subject?',
                      action: () => {
                        deleteSubject(data?.id)
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

export default SubjectTable;
