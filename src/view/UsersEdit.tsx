import {Button, Divider} from "@mui/material";
import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbarContainer,
  GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport, ruRUGrid
} from '@mui/x-data-grid';
import {SqlUser} from "../types";

const columns: GridColDef[] = [
  {
    field: 'login',
    headerName: 'Имя пользователя',
    type: 'string',
    editable: true,
    flex: 1.3
  },
  {
    field: 'pass',
    headerName: 'Пароль',
    type: 'string',
    editable: true,
    flex: 0.9
  },
  {
    field: 'uuid',
    headerName: 'Идентификатор',
    type: 'string',
    editable: true,
    flex: 1
  },
  {
    field: 'access',
    headerName: 'Токен доступа',
    type: 'string',
    editable: true,
    flex: 1
  },
  {
    field: 'server',
    headerName: 'ID сервера',
    type: 'string',
    editable: true,
    flex: 1
  },
  {
    field: 'ip',
    headerName: 'IP адрес при регистрации',
    type: 'string',
    editable: true,
    flex: 1.5
  },
]

export const UsersEdit = () => {

  const [rows, setRows] = React.useState<SqlUser[]>([
    {
      login: 'Dash',
      pass: '12345',
      uuid: '12345678-444-444-444-987987978',
      access: '1321654989651',
      server: '135496879516',
      ip: '127.0.0.1'
    }
  ]);

  function createToolbar() {
    return (
      <GridToolbarContainer>
        <Button color='primary' variant='contained'>Отправить на сервер</Button>
        <Divider orientation='vertical' sx={{mr: 5}}/>
        {/*@ts-ignore*/}
        <GridToolbarExport translate='yes'/>
      </GridToolbarContainer>
    );
  };

  return (
    <div>
      <DataGrid
        localeText={ruRUGrid}
        columns={columns}
        rows={rows}
        autoHeight={true}
        density='comfortable'
        components={{
          Toolbar: createToolbar
        }}
      />
    </div>
  )
};