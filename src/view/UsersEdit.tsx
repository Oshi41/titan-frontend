import {Button, createTheme} from "@mui/material";
import {makeStyles} from "@mui/styles";
import MaterialTable, {Column} from "material-table";
import {Avatar} from "material-ui";
import * as React from 'react';
import {get} from '../api/1.0/index';
import {SqlUser} from "../types";

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';


interface UsersResp {
  items: SqlUser[],
  count: number
}

const columns: Column<any>[] = [
  {title: "id", field: "id", hidden: true},
  {title: "Логин", field: "login", editable: 'always'},
  {title: "Пароль", field: "pass:", editable: 'always'},
  {title: "ID пользователя", field: "uuid", editable: 'always'},
  {title: "Токен", field: "access", editable: 'always'},
  {title: "Сервер", field: "server", editable: 'always'},
  {title: "IP адрес", field: "ip", editable: 'always'},
];

type Sorting = {
  field: string;
  direction: 'asc' | 'desc';
}

export const UsersEdit = () => {

    const [data, setData] = React.useState<SqlUser[]>([]);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [total, setTotal] = React.useState(0);
    const [sorting, setSorting] = React.useState<Sorting[]>([]);
    const [loading, setLoading] = React.useState(false);

    const refresh = React.useCallback(() => {

      setLoading(true);
      let filter = '';

      if (sorting.length > 0) {
        filter += ' order by ' + sorting.map(x => `${x.field} ${x.direction}`)
          .join(', ');
      }

      get('/users', ['filter', filter], ['page', page + ''], ['size', pageSize + ''])
        .then(x => {
          if (x.status !== 200) {
            throw new Error('something wron I can feel it!');
          }

          return x.json();
        })
        .then((x: UsersResp) => {
          const {count, items} = x;
          setTotal(count);
          let tableData: SqlUser[] = items.map((value, index) => {
            const res = {...value};
            // @ts-ignore
            res['id'] = index;
            return res as SqlUser;
          });
          setData(tableData);
        })
        .catch(x => {
          console.log(x);
        })
        .finally(() => {
          setLoading(false);
        })

    }, [page, pageSize, sorting]);
    React.useEffect(refresh, [refresh]);

    const onRowUpdate = (old: SqlUser, row?: SqlUser): Promise<any> => {
      return Promise.reject('no reason');
    };

    const onRowAdd = (row: SqlUser): Promise<any> => {
      return Promise.reject('no reason');
    };

    const onRowDelete = (row: SqlUser): Promise<any> => {
      return Promise.reject('no reason');
    };


    return (
      <MaterialTable columns={columns}
                     data={data}
                     page={page}
                     totalCount={total}
                     isLoading={loading}
                     onChangePage={(page1, pageSize1) => {
                       setPage(page1);
                       setPageSize(pageSize1);
                     }}
                     editable={{
                       onRowUpdate,
                       onRowAdd,
                       onRowDelete
                     }}
      />
    )
  }
;

// const refresh = React.useCallback(() => {
//
//   let filter = '';
//
//   if (sorting.length > 0) {
//     const actual = sorting.filter(x => x.sort);
//     if (actual.length > 0) {
//       filter += ' order by ' + sorting.map(x => `${x.field} ${x.sort}`)
//         .join(', ');
//     }
//   }
//
//
//   get('/users', ['filter', filter], ['page', page + ''], ['size', pageSize + ''])
//     .then(x => {
//       if (x.status !== 200) {
//         throw new Error(x.status + '');
//       }
//
//       return x.json();
//     })
//     .then((x: UsersResp) => {
//       const {items, count} = x;
//       setSource(items);
//       setTotal(count);
//     })
//     .catch(x => {
//       console.log(x);
//     })
// }, [page, pageSize, sorting]);
// React.useEffect(refresh, [refresh]);

//
// const classes = useStyles();
// const apiRef = useGridApiRef();
//
// const [page, setPage] = React.useState(0);
// const [pageSize, setPageSize] = React.useState(10);
// const [total, setTotal] = React.useState(0);
// const [sorting, setSorting] = React.useState<GridSortModel>([]);
//
// const [editMode, setEditMode] = React.useState<GridRowMode>();
// const [rows, setRows] = React.useState<any[]>([]);
//
// const [source, setSource] = React.useState<SqlUser[]>([]);
// React.useEffect(() => {
//   let array: any[] = source.map((value, index) => {
//     return {
//       ...value,
//       id: index,
//     }
//   });
//   setRows(array);
// }, [source]);
//
//
//
// const onRowEditCommit = (params: GridRowId, event: MuiEvent<React.SyntheticEvent>) => {
//   console.log(params);
//
//   // @ts-ignore
//   let row: SqlUser | undefined = rows.find(x => x['id'] === params);
//   if (row) {
//     map.set(params as string, row);
//   }
// };
//
// const handleEvent = React.useCallback((e: MuiEvent<any>) => {
//   e.defaultMuiPrevented = true;
// }, []);
//
// /**
//  * Начало редактирования
//  * @param id
//  */
// const handleEditClick = (id: GridRowId) => (event: MuiEvent<any>) => {
//   event.stopPropagation();
//   apiRef.current.setRowMode(id, 'edit');
// };
//
// /**
//  * Отмена создания
//  * @param id
//  */
// const handleCancelClick = (id: GridRowId) => (event: MuiEvent<any>) => {
//   event.stopPropagation();
//   apiRef.current.setRowMode(id, 'view');
//
//   const row: GridRowModel | null = apiRef.current.getRow(id);
//   if (row?.isNew === true) {
//     apiRef.current.updateRows([{id, _action: 'delete'}]);
//   }
// };
//
// /**
//  * Подтверждаем сохранение
//  * @param id - ID объекта
//  */
// const handleSaveClick = (id: GridRowId) => (event: MuiEvent<any>) => {
//   event.stopPropagation();
//   apiRef.current.commitRowChange(id);
//   apiRef.current.setRowMode(id, 'view');
//
//   const row = apiRef.current.getRow(id);
//   apiRef.current.updateRows([{...row, isNew: false}]);
// };
//
// /**
//  * Удаление объекта
//  * @param id
//  */
// const handleDeleteClick = (id: GridRowId) => (event: MuiEvent<any>) => {
//   event.stopPropagation();
//   apiRef.current.updateRows([{id, _action: 'delete'}]);
// };
//
// const gridColumn = React.useMemo<GridColDef[]>(() => {
//   const result = [...columns];
//
//   const actions = {
//     field: 'actions',
//     type: 'actions',
//     headerName: 'Действия',
//     width: 100,
//     cellClassName: classes.actions,
//     getActions: (param: { id: GridRowId }) => {
//       const {id} = param;
//
//       const isInEditMode = apiRef.current.getRowMode(id) === 'edit';
//
//       if (isInEditMode) {
//         return [
//           <GridActionsCellItem
//             icon={<SaveIcon/>}
//             label="Save"
//             onClick={handleSaveClick(id)}
//             color="primary"
//           />,
//           <GridActionsCellItem
//             icon={<CancelIcon/>}
//             label="Cancel"
//             className={classes.textPrimary}
//             onClick={handleCancelClick(id)}
//             color="inherit"
//           />,
//         ];
//       }
//
//       return [
//         <GridActionsCellItem
//           icon={<EditIcon/>}
//           label="Edit"
//           className={classes.textPrimary}
//           onClick={handleEditClick(id)}
//           color="inherit"
//         />,
//         <GridActionsCellItem
//           icon={<DeleteIcon/>}
//           label="Delete"
//           onClick={handleDeleteClick(id)}
//           color="inherit"
//         />,
//       ];
//     },
//   } as GridColDef;
//
//   result.push(actions);
//
//   return result;
// }, [apiRef?.current?.getRowMode]);
//
// setTimeout(() => {
//   if (apiRef.current.getRowMode !== undefined) {
//     console.log('Need to wait');
//   }
// }, 150);
//
// function EditToolbar(props: { apiRef: GridApiRef }) {
//   const {apiRef} = props;
//
//   const handleClick = () => {
//     const id = rows.length;
//     apiRef.current.updateRows([{id, isNew: true}]);
//     apiRef.current.setRowMode(id, 'edit');
//     // Wait for the grid to render with the new row
//     setTimeout(() => {
//       apiRef.current.scrollToIndexes({
//         rowIndex: apiRef.current.getRowsCount() - 1,
//       });
//
//       apiRef.current.setCellFocus(id, 'name');
//     });
//   };
//
//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon/>} onClick={handleClick}>
//         Add record
//       </Button>
//
//     </GridToolbarContainer>
//   );
// }

// <DataGrid
//   rows={rows}
//   columns={gridColumn}
//   // @ts-ignore
//   editMode='row'
//   apiRef={apiRef}
//   localeText={ruRUGrid}
//   onRowEditCommit={onRowEditCommit}
//   onRowEditStart={handleEvent}
//   onRowEditStop={handleEvent}
//   onCellClick={handleEvent}
//   onPageChange={setPage}
//   onPageSizeChange={setPageSize}
//   onSortModelChange={setSorting}
//   rowCount={total}
//   pageSize={pageSize}
//   pagination
//   autoHeight
//   rowsPerPageOptions={[5, 10, 20]}
//   paginationMode='server'
//   sortingMode='server'
//   throttleRowsMs={50}
//   density='comfortable'
//   components={{
//     Toolbar: EditToolbar
//   }}
//   componentsProps={{
//     toolbar: {
//       apiRef
//     }
//   }}
// />

// const columns: GridColDef[] = [
//   {
//     field: 'login',
//     headerName: 'Имя пользователя',
//     type: 'string',
//     editable: true,
//     resizable: true,
//     disableColumnMenu: true,
//     flex: 1.3,
//   },
//   {
//     field: 'pass',
//     headerName: 'Пароль',
//     type: 'string',
//     editable: true,
//     resizable: true,
//     disableColumnMenu: true,
//     flex: 0.9
//   },
//   {
//     field: 'uuid',
//     headerName: 'Идентификатор',
//     type: 'string',
//     editable: true,
//     resizable: true,
//     disableColumnMenu: true,
//     flex: 1
//   },
//   {
//     field: 'access',
//     headerName: 'Токен доступа',
//     type: 'string',
//     editable: true,
//     resizable: true,
//     disableColumnMenu: true,
//     flex: 1
//   },
//   {
//     field: 'server',
//     headerName: 'ID сервера',
//     type: 'string',
//     editable: true,
//     resizable: true,
//     disableColumnMenu: true,
//     flex: 1
//   },
//   {
//     field: 'ip',
//     headerName: 'IP адрес при регистрации',
//     type: 'string',
//     resizable: true,
//     disableColumnMenu: true,
//     flex: 1.5
//   },
// ]

// const defaultTheme = createTheme();
//
// const useStyles = makeStyles(
//   (theme) => ({
//     actions: {
//       color: theme.palette.text.secondary,
//     },
//     textPrimary: {
//       color: theme.palette.text.primary,
//     },
//   }),
//   {defaultTheme},
// );