import {Box, Checkbox, Chip, FormControl, ListItemText, MenuItem, Select, Stack} from "@mui/material";
import * as React from "react";
import MUIDataTable, {MUIDataTableColumnDef} from "mui-datatables";
import {post} from "../api/1.0/index";
import {Roles, RolesNames, UserInfo} from "../types";

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

export const UsersView = (): JSX.Element => {
  const [data, setData] = React.useState<UserInfo[]>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);

  const refresh = React.useCallback(() => {
    const q: UsersRequest = {
      page,
      size: pageSize,
      sort: {},
      query: {},
    };

    post('/getUsers', q).then(x => x.json()).then((x: UsersResp) => {
      setTotal(x.count);
      const infos: UserInfo[] = x.items.map((value, index) => ({
        ...value,
        id: index
      } as UserInfo));

      setData(infos);
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
    // todo implement
    return false;
  }, [data]);

  const onRowSelectionChange = React.useCallback(
    (current: any[], all: { index: number, dataIndex: number }[], selected?: any[]) => {
    }, []);

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
                      <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1}}>
                        {roles.map((x) => (
                          <Chip key={x} label={RolesNames.get(x)}/>
                        ))}
                      </Box>
                    )}>

              <Stack direction='column'
                     spacing={1}
                     sx={{margin: 2}}
              >
                {Array.from(RolesNames.entries()).map((entry, index) => (
                  <MenuItem key={index} value={entry[0]}>
                    <Checkbox
                      color='primary'
                      checked={roles.includes(entry[0])}
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
  ];

  return (
    <MUIDataTable title='Список зарегистрированных пользователей'
                  data={data}
                  columns={columns}
                  options={{
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
                  }}
    />
  );
}