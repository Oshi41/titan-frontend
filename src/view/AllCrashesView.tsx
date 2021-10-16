import {MuiThemeProvider} from "@material-ui/core";
import {Button, TableCell, TableRow, TextField} from "@mui/material";
import * as React from "react";
import MUIDataTable, {MUIDataTableColumnDef, MUIDataTableMeta} from "mui-datatables";
import {deleteQ, get} from "../api/1.0/index";
import {Report, UserInfo} from "../types";

interface CrashResp {
  total: number;
  crashes: Report[]
}

export const AllCrashesView = (): JSX.Element => {
  const [data, setData] = React.useState<Report[]>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);

  const refresh = React.useCallback(() => {
    get('/crashes', ['page', page - 1 + ''], ['size', pageSize + ''])
      .then(x => x.json())
      .then((x: CrashResp) => {
        const {crashes, total} = x;
        setTotal(total);
        let items: Report[] = crashes.map((value, index) => ({
          ...value,
          id: index,
          date: new Date(value.date).toLocaleString()
        }));

        setData(items);
      })
      .catch(x => {
        console.log(x);
        setTotal(0);
        setData([]);
      })

  }, [page, pageSize]);
  React.useEffect(refresh, [refresh]);

  const onRowsDelete = React.useCallback((
    rowsDeleted: {
      lookup: { [dataIndex: number]: boolean };
      data: Array<{ index: number; dataIndex: number }>;
    },
    newTableData: any[],
  ): void | false => {

    const toDelete: Report[] = rowsDeleted.data.map(x => data[x.dataIndex]);
    let promises: Promise<Response>[] = toDelete.map(x => deleteQ('/crashes', ['login', x.login], ['name', x.file]));

    Promise.all(promises)
      .then(x => {
        refresh();
      })
      .catch(x => {
        console.log(x);
      });

    return false;
  }, [data]);

  const onRowSelectionChange = React.useCallback(
    (current: any[], all: { index: number, dataIndex: number }[], selected?: any[]) => {
    }, []);

  // Порядок не менять, он важен!
  const columns: MUIDataTableColumnDef[] = [
    {
      name: 'login',
      label: 'Имя пользователя',
      options: {
        sort: true,
        filter: true,
        filterType: 'textField'
      },
    },
    {
      name: 'file',
      label: 'Имя файла',
      options: {
        sort: true,
        filter: true,
      }
    },
    {
      name: 'content',
      label: 'Содержание',
      options: {
        sort: true,
        filter: true,
        display: 'false'
      },
    },
    {
      name: 'date',
      label: 'Дата создания',
      options: {
        sort: true,
        filter: false,
      },
    },
    {
      name: 'comment',
      label: 'Комментарий',
      options: {
        sort: true,
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (<TextField
            sx={{minWidth: 500}}
            id="comment_field"
            label="Комментарий"
            value={value}
            multiline
            rows={3}
          />);
        }
      },
    },
  ];

  return (
    <MUIDataTable title='Список краш репортов'
                  data={data}
                  columns={columns}
                  options={{
                    expandableRows: true,
                    selectableRows: 'multiple',
                    search: 'false',
                    print: 'false',
                    filter: 'false',
                    viewColumns: 'false',
                    download: 'false',
                    onRowsDelete: onRowsDelete,
                    onChangePage: setPage,
                    onRowSelectionChange: onRowSelectionChange,
                    onChangeRowsPerPage: setPageSize,
                    renderExpandableRow: (rowData, rowMeta) => {
                      const colSpan = rowData.length + 1;
                      const [a, b, content] = rowData;

                      return <TableRow>
                        <TableCell colSpan={colSpan}>
                          <TextField
                            sx={{display: 'flex', color: 'black'}}
                            id="text_field"
                            label="Содержимое файла"
                            value={content}
                            color='info'
                            multiline
                            rows={15}
                            maxRows={15}
                          />
                        </TableCell>
                      </TableRow>;
                    }
                  }}
    />
  );
}