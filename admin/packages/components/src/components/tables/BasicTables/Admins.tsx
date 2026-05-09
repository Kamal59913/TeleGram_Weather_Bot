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
import schoolAdminService from "../../../api/services/schoolsAdminService";
import Badge from "../../ui/badge/Badge";
import { useGetSchoolAdmins } from "../../../hooks/queries/admins/useAdmins";
interface SchoolsTableProps {
  title: string;
}
const AdminsTable: React.FC<SchoolsTableProps> = () => {
  const { data: localData, isPending } = useGetSchoolAdmins();
  const { open, close } = useModalData();
  const navigate = useNavigate();
  const deleteAdmin = async (_id: string) => {
    const response = await schoolAdminService.deleteAdminById(_id)
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
                Role
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Active
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
                        !isPending && !localData?.admins?.length &&
                        <TableRow>
                          <td className="text-center px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400" colSpan={6}>
                            No Data
                          </td>
                        </TableRow>
                      }
            {localData?.admins?.map((admin: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {admin.name || 'NA'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {admin.email || 'NA'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {admin?.role?.name || 'NA'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <Badge
                    size="sm"
                    color={
                      admin.isActive === true
                        ? "success" : "error"
                    }
                  >
                    {admin.isActive ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <ActionIcons onEdit={()=> navigate(`edit-school-admin/${admin.id}`)} onDelete={ () => {open('delete-action', {
                    title: 'Are you sure want to delete this School Admin?',
                    action: () => {
                      deleteAdmin(admin?.id)
                    }
                  })} }
                  title="School Admin"/>
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

export default AdminsTable;
