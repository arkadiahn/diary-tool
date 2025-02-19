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
const CustomActionsComponent = (props: any) => {
    return (
        <div className="flex gap-2 items-center justify-center h-full">
            {props.onEditEvent && (
                <Button size="sm" onPress={() => props.onEditEvent(props.data)}>
                    Edit
                </Button>
            )}
            {props.onDeleteEvent && (
                <Button size="sm" color="danger" onPress={() => props.onDeleteEvent(props.data)}>
                    Delete
                </Button>
            )}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                                 CustomGrid                                 */
/* -------------------------------------------------------------------------- */
interface CustomGridProps {
    data: any[];
    loading: boolean;
    tableTitle: string;
    columnDefs: (ColDef<any, any> | ColGroupDef<any>)[];
    onEdit?: (data: any) => void;
    onDelete?: (data: any) => void;
    onCreate?: () => void;
}

export default forwardRef(function CustomGrid(
    { columnDefs, data, tableTitle, loading = false, onEdit, onDelete, onCreate }: CustomGridProps,
    ref: ForwardedRef<AgGridReact>,
) {
    const { resolvedTheme } = useTheme();

    const handleEdit = (data: any) => {
        onEdit?.(data);
    };

    const handleDelete = (data: any) => {
        onDelete?.(data);
    };

    return (
        <>
            <div className="flex justify-between items-center w-full mb-4">
                <h1 className="text-2xl font-bold">{tableTitle}</h1>
                {onCreate && (
                    <Button
                        size="sm"
                        color="primary"
                        onPress={onCreate}
                        startContent={<CustomIcon icon={plus} width={16} height={16} />}
                    >
                        Create
                    </Button>
                )}
            </div>
            <div className="max-h-[800px] h-full w-full">
                <AgGridReact
                    ref={ref}
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
                                      },
                                      minWidth: (onEdit ? 100 : 0) + (onDelete ? 100 : 0),
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
});
