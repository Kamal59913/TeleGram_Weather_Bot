import { DeleteIcon, EditIcon } from "../../icons";
import Tooltip from "../ui/tooltip/tooltip"

interface ActionIconsProps {
    isPermanent?: boolean;
    onEdit: () => void;
    onDelete: () => void;
    title: string;
}

export const ActionIcons: React.FC<ActionIconsProps> = ({ isPermanent = false, onEdit, onDelete, title }) => {
    return (
        <div className="flex gap-2">
            <Tooltip text={`Edit ${title}`}>

                <EditIcon className={`dark:text-white text-gray-dark cursor-pointer hover:text-green-500 dark:hover:text-green-500`}
                    onClick={onEdit} />

            </Tooltip>

            <Tooltip text={`Delete ${title}`}>

                {
                    !isPermanent && <DeleteIcon className={`dark:text-white text-gray-dark cursor-pointer text-medium hover:text-red-500 dark:hover:text-red-500`}
                        onClick={!isPermanent ? onDelete : undefined}
                    />
                }

            </Tooltip>

        </div>
    )
}