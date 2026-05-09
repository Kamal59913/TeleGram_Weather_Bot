import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useModalData } from "../../../redux/hooks/useModal";
import rolesService from "../../../api/services/rolesService";
import { ToastService } from "../../../utils/toastService";
import { useGetPermissions } from "../../../hooks/queries/permisions/usePermissions";

interface PermissionsTableProps {
  title: string;
}
const PermissionsTable: React.FC<PermissionsTableProps> = () => {
  const { data: localData, isPending } = useGetPermissions();

  const { open, closeById } = useModalData();

  const deleteRole = async (_id: string) => {
    const response = await rolesService.deleteRole(_id);
    if (response.success) {
      ToastService.success(`${response.message || 'Role Deleted Successfully'}`, 'delete-role')
      closeById('confirm-delete')
    } else {
      ToastService.success(`${response.message || 'Failed Deleting Role'}`, 'delete-role-fail')
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
                className="pr-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Description
              </TableCell>
             

            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {
              !isPending && !localData?.permissions?.length &&
              <TableRow>
                <td className="text-center px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400" colSpan={3}>
                  No Data
                </td>
              </TableRow>
            }
            {localData?.permissions?.map((permission: any, index: number) => (
              <TableRow key={permission._id}>
                <TableCell className="pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {index + 1}
                </TableCell>
                <TableCell className="pr-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {permission.name || 'NA'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {permission.description || 'NA'}
                </TableCell>
              
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PermissionsTable;
