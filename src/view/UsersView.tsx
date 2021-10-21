import { Delete, Save } from '@material-ui/icons';
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
import MUIDataTable, { DisplayData, MUIDataTableColumnDef, MUISortOptions } from 'mui-datatables';
import * as React from 'react';
import { deleteJson, postJson } from '../api/1.0/index';
import { Roles, RolesNames, UserInfo, WebToken } from '../types';
import { getToken } from '../utils/index';

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
  edited: boolean;
}

export const UsersView = (): JSX.Element => {
  const [ data, setData ] = React.useState<TableData[]>([]);
  const [ page, setPage ] = React.useState(1);
  const [ pageSize, setPageSize ] = React.useState(10);
  const [ total, setTotal ] = React.useState(0);
  const [ sorting, setSorting ] = React.useState<MUISortOptions>({ name: 'login', direction: 'asc' });
  const [ loading, setLoading ] = React.useState(false);

  // список изменений
  const [ changed, setChanged ] = React.useState<Map<string, UserInfo>>(new Map());

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
        edited: false,
      } as TableData));

      setData(infos);
    })
      .finally(() => setLoading(false));

  }, [ page, pageSize, sorting ]);
  // Обновление при смене одного из элементов
  React.useEffect(refresh, [ refresh ]);

  /**
   * Текущий токен
   */
  let token: WebToken | undefined = getToken();

  /**
   * Удаление строк
   */
  const onRowsDelete = React.useCallback((source: UserInfo[]): void => {
    // удаляю ненужные поля
    const items = source.map(x => ({ login: x.login }));

    const promises: Promise<Response>[] = items.map(x => deleteJson('/users', x));
    Promise.all(promises)
      .then(x => {
        refresh();
      })
      .catch(x => {
        console.log(x);
      });

  }, [ data, refresh ]);

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
      <Stack direction="row" sx={{ mr: 2 }}>
        {canDelete && (
          <Tooltip title="Удалить">
            <IconButton aria-label="delete"
                        size="large"
                        onClick={() => onRowsDelete(items)}>
              <Delete fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    );
  }, [ data, onRowsDelete ]);

  // определение колонок
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

          return (
            <Select multiple
                    id="select_id"
                    value={value}
                    MenuProps={MenuProps}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
                        {roles.map((x) => (
                          <Chip key={x} label={RolesNames.get(x)} />
                        ))}
                      </Box>
                    )}>
              -
              <Stack direction="column"
                     spacing={1}
                     sx={{ margin: 2 }}
              >
                {Array.from(RolesNames.entries()).map((entry, index) => (
                  <MenuItem key={index} value={entry[0]}>
                    <Checkbox
                      color="primary"
                      checked={roles.includes(entry[0])}
                    />
                    <ListItemText primary={entry[1]} />
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
          if (!value || !token?.roles?.includes(Roles.UserEdit)) {
            return <></>;
          }

          return <Tooltip title="Удалить">
            <IconButton aria-label="save"
                        size="large"
                        onClick={() => {}}>
              <Save fontSize="inherit" />
            </IconButton>
          </Tooltip>;
        }
      }
    }
  ];

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress color="inherit" />
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
                      onColumnSortChange: (changedColumn, direction) => setSorting({ name: changedColumn, direction }),
                      onChangeRowsPerPage: setPageSize,
                    }} />
    </>
  );
};
