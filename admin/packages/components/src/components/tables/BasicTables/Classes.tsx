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
import schoolClassService from "../../../api/services/schoolsClassService";
import { formatDate } from "../../../utils/formateDate";
import Tooltip from "../../ui/tooltip/tooltip";
import { ClassSection } from "../../../icons";
import { useGetSchoolClasses } from "../../../hooks/queries/class/useClasses";
interface ClassTableProps {
  title: string;
}
const ClassesTable: React.FC<ClassTableProps> = () => {
  const { data: localData, isPending } = useGetSchoolClasses();
  const { open, close } = useModalData();
  const navigate = useNavigate();

  const deleteClass = async (_id: string) => {
    const response = await schoolClassService.deleteClassById(_id)
    if (response.success) {
      ToastService.success(`${response.message || 'Class Deleted Successfully'}`, 'delete-class')
      close()
    } else {
      ToastService.success(`${response.message || 'Failed Deleting Class'}`, 'delete-class-fail')
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
                Grade
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
              !isPending && !localData?.data?.length &&
              <TableRow>
                <td className="text-center px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400" colSpan={5}>
                  No Data
                </td>
              </TableRow>
            }
            {localData?.data?.map((school_class: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {school_class?.grade || 'NA'}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatDate(school_class?.createdAt, { format: 'date' }) || 'NA'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatDate(school_class?.updatedAt, { format: 'date' }) || 'NA'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2">

                    <Tooltip text={"Add Section"}>
                      <ClassSection className="dark:text-white text-gray-dark cursor-pointer hover:text-primary dark:hover:text-primary"
                        onClick={() => navigate(`/class-section-management/add-class-section?id=${school_class.id}`)}
                      />
                    </Tooltip>
                    <ActionIcons onEdit={() => navigate(`edit-school-class/${school_class.id}`)} onDelete={() => {
                      open('delete-action', {
                        title: 'Are you sure want to delete this Class?',
                        action: () => {
                          deleteClass(school_class?.id)
                        }
                      })
                    }}
                      title="Class" />
                  </div>
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

export default ClassesTable;
