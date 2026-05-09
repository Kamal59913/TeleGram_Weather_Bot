import Badge from "../../ui/badge/Badge";
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
import { ActionIcons } from "../../action/action";
import { useGetRole } from "../../../hooks/queries/roles/useRoles";

interface RolesTableProps {
  title: string;
}
const RolesTable: React.FC<RolesTableProps> = () => {
  const { data: localData, isPending } = useGetRole();

  const { open, closeById, close } = useModalData();

  const deleteRole = async (_id: string) => {
    const response = await rolesService.deleteRole(_id);
    if (response.success) {
      ToastService.success(`${response.message || 'Role Deleted Successfully'}`, 'delete-role')
      closeById('delete-action')
      close()
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
                className="px-4 py-3 font-medium text-gray-dark text-start text-theme-th dark:text-gray-400"
              >
                Permenant
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
              !isPending && !localData?.roles?.length &&
              <TableRow>
                <td className="text-center px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400" colSpan={4}>
                  No Data
                </td>
              </TableRow>
            }

            {localData?.roles?.map((role: any, index: number) => (
              <TableRow key={role._id}>
                <TableCell className="pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="pr-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {role.name || 'NA'}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      role.isPermanent === true
                        ? "success" : "error"
                    }
                  >
                    {role.isPermanent ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <ActionIcons
                      isPermanent={role?.isPermanent}
                      onEdit={() => open("edit-role", role)}
                      onDelete={() => open("delete-action", {
                        title: "Are you sure you want to delete this role?",
                        description: "This action cannot be undone.",
                        action: () => deleteRole(role.id),
                      })}
                      title="Role"
                    />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RolesTable;
