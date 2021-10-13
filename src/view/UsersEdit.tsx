import {Button, Divider} from "@mui/material";
import * as React from 'react';
import {get} from '../api/1.0/index';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  ruRUGrid,
  GridRowParams, MuiEvent, GridRowId, GridCellParams, GridRowMode, useGridApiRef, GridApiRef
} from '@mui/x-data-grid';
import {SqlUser} from "../types";

const columns: GridColDef[] = [
  {
    field: 'login',
    headerName: 'Имя пользователя',
    type: 'string',
    editable: true,
    flex: 1.3,
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

const map = new Map<string, SqlUser>();

export const UsersEdit = () => {
  const apiRef = useGridApiRef();

  const [editMode, setEditMode] = React.useState<GridRowMode>();
  const [currentRow, setCurrentRow] = React.useState<GridRowParams>();
  React.useEffect(() => {
    if (currentRow?.id && apiRef?.current?.getRowMode) {
      setEditMode(apiRef.current.getRowMode(currentRow.id));
    }

    setEditMode('view');
  }, [currentRow]);
  const [rows, setRows] = React.useState<any[]>([]);

  const [source, setSource] = React.useState<SqlUser[]>([]);
  React.useEffect(() => {
    let array: any[] = source.map((value, index) => {
      return {
        ...value,
        id: index,
      }
    });
    setRows(array);
  }, [source]);

  const refresh = React.useCallback(() => {
    get('/users', ['page', '0'], ['size', '25'])
      .then(x => {
        if (x.status !== 200) {
          throw new Error(x.status + '');
        }

        return x.json();
      })
      .then(x => {
        setSource(x as SqlUser[]);
      })
      .catch(x => {
        console.log(x);
      })
  }, []);

  React.useEffect(refresh, []);

  const onRowEditCommit = (params: GridRowId, event: MuiEvent<React.SyntheticEvent>) => {
    console.log(params);

    // @ts-ignore
    let row: SqlUser | undefined = rows.find(x => x['id'] === params);
    if (row) {
      map.set(params as string, row);
    }
  };

  // Prevent from rolling back on escape
  const handleCellKeyDown = React.useCallback((params, event) => {
    if (['Escape', 'Delete', 'Backspace', 'Enter'].includes(event.key)) {
      event.defaultMuiPrevented = true;
    }
  }, []);

  // Prevent from committing on focus out
  const handleCellFocusOut = React.useCallback((params, event) => {
    if (params.cellMode === 'edit' && event) {
      event.defaultMuiPrevented = true;
    }
  }, []);

  const handleRowClick = React.useCallback((params) => {
    setCurrentRow(params);
  }, []);

  const handleDoubleCellClick = React.useCallback((params, event) => {
    event.defaultMuiPrevented = true;
  }, []);

  const createToolbar = React.useCallback((params: { apiRef: GridApiRef }) => {
    const {apiRef} = params;

    const handleMouseDown = (event: { preventDefault: () => void }) => {
      // Keep the focus in the cell
      event.preventDefault();
    };

    const handleClick = () => {
      if (!currentRow || !apiRef?.current?.getRowMode) {
        return;
      }

      const {id, row, columns} = currentRow;
      const mode = apiRef.current.getRowMode(id);

      if (mode === 'edit') {
        apiRef.current.commitRowChange(id);
        apiRef.current.setRowMode(id, 'view');
        setCurrentRow({...currentRow});
      } else {
        apiRef.current.setRowMode(id, 'edit');
        setCurrentRow({...currentRow});
      }
    };

    return (
      <GridToolbarContainer>
        {/*<Button color='primary'*/}
        {/*        variant='contained'*/}
        {/*        disabled={!currentRow}*/}
        {/*        onClick={handleClick}*/}
        {/*        onMouseDown={handleMouseDown}*/}
        {/*        sx={{mr: 2}}>*/}
        {/*  {editMode === 'edit' ? 'Сохранить' : 'Редактировать'}*/}
        {/*</Button>*/}

        {/*<Divider orientation='vertical' sx={{mr: 5}}/>*/}
        {/*@ts-ignore*/}
        <GridToolbarExport translate='yes'/>


      </GridToolbarContainer>
    );
  }, [currentRow, editMode]);

  return (
    <div>
      <DataGrid
        localeText={ruRUGrid}
        // @ts-ignore
        apiRef={apiRef}
        editMode='row'
        onRowEditCommit={onRowEditCommit}
        onRowClick={handleRowClick}
        onCellDoubleClick={handleDoubleCellClick}
        onCellFocusOut={handleCellFocusOut}
        onCellKeyDown={handleCellKeyDown}
        columns={columns}
        rows={rows}
        autoHeight={true}
        density='comfortable'
        components={{
          Toolbar: createToolbar
        }}
        componentsProps={{
          toolbar: {
            apiRef
          }
        }}
      />
    </div>
  )
};