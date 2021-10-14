import {Delete} from "@material-ui/icons";
import {Button, TableCell, TableRow, TextField} from "@mui/material";
import * as React from "react";
import MUIDataTable, {MUIDataTableColumnDef, MUIDataTableMeta} from "mui-datatables";
import {deleteQ, get} from "../api/1.0/index";
import {Report, SqlUser} from "../types";

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

  const onDelete = React.useCallback((x: Report) => {
    deleteQ('/crashes', ['login', x.login], ['name', x.file])
      .then(x => {
        refresh();
      })
      .catch(x => console.log(x));
  }, [refresh]);

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
          return <TextField
            sx={{minWidth: 500}}
            id="comment_field"
            label="Комментарий"
            value={value}
            disabled
            multiline
            minRows={3}
            maxRows={15}
          />
        }
      },
    },
    {
      name: 'actions',
      label: 'Действия',
      options: {
        sort: false,
        filter: false,
        customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (value: string) => void) => {
          // @ts-ignore
          let [login, file] = tableMeta.tableData[tableMeta.rowIndex];

          const report = {
            login: login as string,
            file: file as string
          } as Report;

          return (
            <Button startIcon={<Delete/>} onClick={e => onDelete(report)}>Удалить</Button>
          )
        },
      }
    },
  ];

  return (
    <div>
      <MUIDataTable columns={columns}
                    data={data}
                    title='Список краш репортов'
                    options={{
                      expandableRows: true,
                      search: 'false',
                      print: 'false',
                      filter: 'false',
                      viewColumns: 'false',
                      download: 'false',
                      renderExpandableRow: (rowData, rowMeta) => {
                        const colSpan = rowData.length + 1;
                        const [a, b, content] = rowData;

                        return <TableRow>
                          <TableCell colSpan={colSpan}>
                            <TextField
                              sx={{display: 'flex'}}
                              id="text_field"
                              label="Содержимое файла"
                              value={content}
                              disabled
                              multiline
                              rows={15}
                              maxRows={15}
                            />
                          </TableCell>
                        </TableRow>;
                      }
                    }}
      />
    </div>
  );
}