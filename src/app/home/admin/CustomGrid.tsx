import CustomIcon from "@/components/CustomIcon";
import { Button } from "@heroui/react";
import {
    AllCommunityModule,
    type ColDef,
    type ColGroupDef,
    ModuleRegistry,
    colorSchemeDark,
    themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useTheme } from "next-themes";
import { type ForwardedRef, forwardRef } from "react";

/* ---------------------------------- Icons --------------------------------- */
import plus from "@iconify/icons-ic/baseline-plus";

ModuleRegistry.registerModules([AllCommunityModule]);

/* -------------------------------------------------------------------------- */
/*                              ActionsComponent                              */
/* -------------------------------------------------------------------------- */
const CustomActionsComponent = <T,>(props: {
    data: T;
    onEditEvent?: (data: T) => void | Promise<void>;
    onDeleteEvent?: (data: T) => void | Promise<void>;
    onUndeleteEvent?: (data: T) => void | Promise<void>;
}) => {
    return (
        <div className="flex gap-2 items-center justify-start h-full">
            {props.onEditEvent && (
                <Button size="sm" onPress={() => props.onEditEvent?.(props.data)}>
                    Edit
                </Button>
            )}
            {props.onDeleteEvent && (
                <Button size="sm" color="danger" onPress={() => props.onDeleteEvent?.(props.data)}>
                    Delete
                </Button>
            )}
            {props.onUndeleteEvent && "delete_time" in (props.data as unknown as object) && (
                <Button size="sm" color="warning" onPress={() => props.onUndeleteEvent?.(props.data)}>
                    Undelete
                </Button>
            )}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                                 CustomGrid                                 */
/* -------------------------------------------------------------------------- */
interface CustomGridProps<T> {
    data: T[];
    loading: boolean;
    tableTitle: string;
    columnDefs: (ColDef<T> | ColGroupDef<T>)[];
    onEdit?: (data: T) => void | Promise<void>;
    onDelete?: (data: T) => void | Promise<void>;
    onUndelete?: (data: T) => void | Promise<void>;
    onCreate?: (data: null) => void | Promise<void>;
}

function CustomGrid<T>({
    columnDefs,
    data,
    tableTitle,
    loading = false,
    onEdit,
    onDelete,
    onCreate,
    onUndelete,
}: CustomGridProps<T>) {
    const { resolvedTheme } = useTheme();

    const handleEdit = async (data: T) => {
        await onEdit?.(data);
    };

    const handleDelete = async (data: T) => {
        await onDelete?.(data);
    };

    const handleUndelete = async (data: T) => {
        await onUndelete?.(data);
    };

    return (
        <>
            <div className="flex justify-between items-center w-full mb-4">
                <h1 className="text-2xl font-medium">{tableTitle}</h1>
                {onCreate && (
                    <Button
                        size="sm"
                        color="primary"
                        onPress={() => onCreate?.(null)}
                        startContent={<CustomIcon icon={plus} width={16} height={16} />}
                    >
                        Create
                    </Button>
                )}
            </div>
            <div className="max-h-[800px] h-full w-full">
                <AgGridReact
                    loading={loading}
                    theme={resolvedTheme === "dark" ? themeQuartz.withPart(colorSchemeDark) : themeQuartz}
                    suppressCellFocus={true}
                    rowData={data}
                    columnDefs={[
                        ...columnDefs,
                        ...(onEdit || onDelete
                            ? [
                                  {
                                      headerName: "Actions",
                                      cellRenderer: CustomActionsComponent,
                                      cellRendererParams: {
                                          onEditEvent: onEdit ? handleEdit : undefined,
                                          onDeleteEvent: onDelete ? handleDelete : undefined,
                                          onUndeleteEvent: onUndelete ? handleUndelete : undefined,
                                      },
                                      minWidth: (onEdit ? 100 : 0) + (onDelete ? 100 : 0) + (onUndelete ? 100 : 0),
                                  },
                              ]
                            : []),
                    ]}
                    defaultColDef={{
                        editable: false,
                        flex: 1,
                        minWidth: 100,
                        filter: true,
                        sortable: true,
                    }}
                    pagination={true}
                    paginationPageSize={20}
                />
            </div>
        </>
    );
}

export default CustomGrid;
