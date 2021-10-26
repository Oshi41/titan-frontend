import {Delete, Save} from '@material-ui/icons';
import {
  Backdrop,
  Box,
  Checkbox,
  Chip,
  IconButton,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Tooltip
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import MUIDataTable, {DisplayData, MUIDataTableColumnDef, MUISortOptions} from 'mui-datatables';
import * as React from 'react';
import {deleteJson, postJson} from '../api/1.0/index';
import {Roles, RolesNames, UserInfo, WebToken} from '../types';
import {getToken} from '../utils/index';

interface UsersResp {
  items: UserInfo[],
  count: number
}

interface UsersRequest {
  page: number;
  size: number;
  query: any;
  sort: any;
}

interface TableData extends UserInfo {
  id: number;
}

export const UsersView = (): JSX.Element => {
  const [data, setData] = React.useState<TableData[]>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [sorting, setSorting] = React.useState<MUISortOptions>({name: 'login', direction: 'asc'});
  const [loading, setLoading] = React.useState(false);

  // список изменений
  const [changed, setChanged] = React.useState<string[]>([]);

  /**
   * Callback обновления
   */
  const refresh = React.useCallback(() => {
    setLoading(true);

    const q: UsersRequest = {
      page: page - 1,
      size: pageSize,
      sort: {},
      query: {},
    };

    if (sorting?.name) {
      q.sort[sorting.name] = sorting.direction === 'asc' ? 1 : -1;
    }

    postJson('/users', q).then(x => x.json()).then((x: UsersResp) => {
      setTotal(x.count);
      const infos = x.items.map((value, index) => ({
        ...value,
        id: index,
      } as TableData));

      setData(infos);
    })
      .finally(() => setLoading(false));

  }, [page, pageSize, sorting]);
  // Обновление при смене одного из элементов
  React.useEffect(refresh, [refresh]);

  /**
   * Текущий токен
   */
  let token: WebToken | undefined = getToken();

  /**
   * Удаление строк
   */
  const onRowsDelete = React.useCallback((source: UserInfo[]): void => {
    // удаляю ненужные поля
    const items = source.map(x => ({login: x.login}));

    const promises: Promise<Response>[] = items.map(x => deleteJson('/users', x));
    Promise.all(promises)
      .then(x => {
        refresh();
      })
      .catch(x => {
        console.log(x);
      });

  }, [data, refresh]);

  /**
   * Изменяю строку и отправляю на сервер
   */
  const onRowEditConfirm = React.useCallback((_id: string) => {
    const item = data.find(x => x._id === _id);
    if (!item) {
      return;
    }

    const payload = {...item};

    // Удаляю ненужные поля
    // @ts-ignore
    delete payload['id'];

    setLoading(true);

    postJson('/edit_users', payload)
      .then(x => {
        setChanged(changed.filter(x => x !== _id));
        refresh();
      })
      .catch(x => {
        console.log(x);
      });

  }, [data, refresh]);

  /**
   * Изменяю значение строки в таблице
   */
  const onRowEdit = React.useCallback((_id: string, func: (x: TableData) => TableData) => {
    const item = data.find(x => x._id === _id);
    if (!item) {
      return;
    }

    // Редактировать свою учётку низя
    if (item.login === token?.login) {
      return;
    }

    let index: number = data.indexOf(item);
    if (index < 0) {
      return;
    }

    const result = func(item);
    if (!result) {
      return;
    }

    data[index] = result;
    if (!changed.includes(_id)) {
      setChanged([...changed, _id]);
    }

    setData([...data]);
  }, [data, changed]);

  /**
   * Катомный тулбар
   */
  const renderSelectToolbar = React.useCallback((
    selectedRows: { data: Array<{ index: number; dataIndex: number }>; lookup: { [key: number]: boolean } },
    displayData: DisplayData,
    setSelectedRows: (rows: number[]) => void,
  ) => {

    // Нашёл данные в массиве
    const items = selectedRows.data
      .map(x => x.dataIndex)
      .map(x => data[x]);

    // привилегии + не могу удалить себя
    const canDelete = token?.roles?.includes(Roles.UserDelete) && items.every(x => x.login !== token?.login);

    return (
      <Stack direction="row" sx={{mr: 2}}>
        {canDelete && (
          <Tooltip title="Удалить">
            <IconButton aria-label="delete"
                        size="large"
                        onClick={() => onRowsDelete(items)}>
              <Delete fontSize="inherit"/>
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    );
  }, [data, onRowsDelete, token]);

  // определение колонок
  const columns: MUIDataTableColumnDef[] = React.useMemo(() => [
    {
      name: '_id',
      label: 'ID',
      options: {
        display: 'excluded'
      }
    },
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
      name: 'pass',
      label: 'Пароль',
      options: {
        sort: true,
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'uuid',
      label: 'ID игрока',
      options: {
        sort: true,
        filter: true,
        filterType: 'textField'
      },
    },
    {
      name: 'whitelisted',
      label: 'Проверен',
      options: {
        sort: true,
        filter: true,
        filterType: 'checkbox',
        customBodyRender: (value, tableMeta, updateValue) => {
          const _id = tableMeta.rowData[0];

          return <Checkbox value={value}
                           onChange={(event, checked) => {
                             onRowEdit(_id, x => {
                               x.whitelisted = checked;
                               return {...x};
                             })
                           }}/>
        }
      },
    },
    {
      name: 'access',
      label: 'Текущий токен доступа',
      options: {
        sort: true,
        filter: true,
        filterType: 'textField'
      },
    },
    {
      name: 'server',
      label: 'ID посл. сервера',
      options: {
        sort: true,
        filter: true,
        filterType: 'textField'
      },
    },
    {
      name: 'ip',
      label: 'IP регистрации',
      options: {
        sort: true,
        filter: true,
        filterType: 'textField'
      },
    },
    {
      name: 'roles',
      label: 'Список ролей',
      options: {
        sort: true,
        filter: true,
        filterType: 'dropdown',
        customBodyRender: (value, tableMeta, updateValue) => {
          const roles = (value as Roles[]) ?? [];
          const ITEM_HEIGHT = 48;
          const ITEM_PADDING_TOP = 8;
          const MenuProps = {
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
              },
            },
          };
          const _id = tableMeta.rowData[0];

          return (
            <Select multiple
                    id="select_id"
                    value={value}
                    MenuProps={MenuProps}
                    renderValue={(selected) => (
                      <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1}}>
                        {roles.map((x) => (
                          <Chip key={x} label={RolesNames.get(x)}/>
                        ))}
                      </Box>
                    )}>
              -
              <Stack direction="column"
                     spacing={1}
                     sx={{margin: 2}}
              >
                {Array.from(RolesNames.entries()).map((entry, index) => (
                  <MenuItem key={index} value={entry[0]}>
                    <Checkbox
                      color="primary"
                      checked={roles.includes(entry[0])}
                      onChange={(event, checked) => {
                        onRowEdit(_id, x => {
                          const role: Roles = entry[0];
                          if (checked) {
                            x.roles.push(role);
                          } else {
                            x.roles = x.roles.filter(r => r !== role);
                          }

                          return {...x};
                        });
                      }}
                    />
                    <ListItemText primary={entry[1]}/>
                  </MenuItem>
                ))}
              </Stack>
            </Select>
          );
        },
        filterOptions: {
          names: Object.keys(Roles),
          // @ts-ignore
          renderValue: value => RolesNames.get(value as Roles),
        }
      },
    },
    {
      name: 'actions',
      label: ' ',
      options: {
        sort: false,
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (!token || token.roles.length < 0) {
            return <></>;

          }

          // ID поля
          const _id = tableMeta.rowData[0];
          const login = tableMeta.rowData[1];

          return <Stack>
            {token.roles.includes(Roles.UserEdit) && changed.includes(_id) && (
              <Tooltip title="Сохранить">
                <IconButton aria-label="save"
                            size="large"
                            onClick={() => {
                              onRowEditConfirm(_id);
                            }}>
                  <Save fontSize="inherit"/>
                </IconButton>
              </Tooltip>
            )}

            {token.roles.includes(Roles.UserDelete) && token.login != login && (
              <Tooltip title="Удалить">
                <IconButton aria-label="delete"
                            size="large"
                            onClick={() => {
                              const item = data.find(x => x._id === _id);
                              if (item) {
                                onRowsDelete([item]);
                              }
                            }}>
                  <Delete fontSize="inherit"/>
                </IconButton>
              </Tooltip>
            )}
          </Stack>;
        }
      }
    }
  ] as MUIDataTableColumnDef[], [onRowEdit, token, changed]);

  return (
    <>
      <Backdrop
        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={loading}>
        <CircularProgress color="inherit"/>
      </Backdrop>

      <MUIDataTable title="Список зарегистрированных пользователей"
                    data={data}
                    columns={columns}
                    options={{
                      selectableRows: 'multiple',
                      customToolbarSelect: renderSelectToolbar,
                      search: 'false',
                      print: 'false',
                      filter: 'false',
                      viewColumns: 'false',
                      download: 'false',
                      onChangePage: setPage,
                      page,
                      rowsPerPage: pageSize,
                      serverSide: true,
                      count: total,
                      sortOrder: sorting,
                      onColumnSortChange: (changedColumn, direction) => setSorting({name: changedColumn, direction}),
                      onChangeRowsPerPage: setPageSize,
                    }}/>
    </>
  );
};
