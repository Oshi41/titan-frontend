import {Stack, TextField} from '@mui/material';
import * as React from 'react';
import {NewsItem} from '../types';

interface Props {
  source: NewsItem;
}

export const NewsEdit = (props: Props): JSX.Element => {

  const [copy, setCopy] = React.useState<NewsItem>();
  React.useEffect(() => setCopy({...props?.source}), [props.source]);

  return (
    <Stack direction='column'
           spacing={2}>

      <TextField
        id="text_name"
        label="Заголовок новости"
        defaultValue={copy?.name ?? ''}
        helperText="Введите название новости"
      />

    </Stack>
  );
};