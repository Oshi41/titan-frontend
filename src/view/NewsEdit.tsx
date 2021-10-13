import {createTheme, Stack, TextField} from '@mui/material';
import {ThemeProvider} from "@mui/styles";
import MUIRichTextEditor from "mui-rte";
import * as React from 'react';
import {NewsItem} from '../types';
import {convertFromHTML, ContentState, convertToRaw, convertFromRaw} from 'draft-js'

interface Props {
  source: NewsItem;
}

export const NewsEdit = (props: Props): JSX.Element => {

  const [copy, setCopy] = React.useState<NewsItem>();
  React.useEffect(() => setCopy({...props?.source}), [props.source]);

  const content = React.useMemo(() => {
    if (!copy?.html) {
      return 'smth';
    }

    const contentHTML = convertFromHTML(copy.html);
    const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
    const content = JSON.stringify(convertToRaw(state));
    return content;
  }, [copy?.html]);


  const onSave = (data: string) => {
    console.log(data)
  }

  return (
    <Stack direction='column'
           spacing={2}>

      <TextField
        id="text_name"
        label="Заголовок новости"
        defaultValue={copy?.name ?? ''}
        helperText="Введите название новости"
      />

      <ThemeProvider theme={createTheme()}>
        <MUIRichTextEditor
          label='Start typing...'
          onSave={onSave}
        />
      </ThemeProvider>

    </Stack>
  );
};