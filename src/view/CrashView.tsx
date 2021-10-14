import * as React from 'react';
import {Button, Link, Stack, TextField, Typography} from "@mui/material";
import {styled} from '@mui/material/styles';
import {post} from "../api/1.0/index";
import {getToken} from "../utils/index";

const Input = styled('input')({
  display: 'none',
});

export const CrashView = () => {

  const [text, setText] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [help, setHelp] = React.useState<string | undefined>(undefined);
  const [loaded, setLoaded] = React.useState<boolean | undefined>(undefined);

  const onSave = (e: any) => {
    let token = getToken();
    if (!token?.login) {
      return;
    }

    setLoaded(undefined);
    setHelp(undefined);

    const data = new FormData();
    data.append('author', token.login);
    data.append('comment', text);
    // @ts-ignore
    data.append('file', file);

    post('/crash', data)
      .then(x => {
        setHelp('Отчет был успешно загружен');
        setLoaded(true);
        setText('');
        setFile(null);
      })
      .catch(x => {
        console.log(x);
        setHelp('Ошибка при загрузке');
        setLoaded(false);
      });
  };

  return (
    <Stack direction='column'
           spacing={2}>

      <Typography sx={{fontSize: 24}}>Произошла проблема? Отправь её сюда!</Typography>

      <label htmlFor="contained-button-file">
        <Input accept="text/plain"
               id="contained-button-file"
               onChange={e => setFile(e?.target?.files?.item(0) as File | null)}
               type="file"/>
        <Button variant="contained"
                component="span">
          Загрузить файл отчета
        </Button>
      </label>

      {file?.name && (
        <Typography sx={{fontSize: 16}}>{file.name}</Typography>
      )}

      <TextField
        id="text_comment"
        label="Коментарий для отчета"
        value={text}
        onChange={event => setText(event.target.value)}
        multiline
        rows={15}
        maxRows={15}
        color={loaded === true ? 'success' : 'primary'}
        error={loaded === false}
        helperText={help ?? 'Краткая информация, которую необходимо донести автору проекта'}
      />

      <Button variant='contained'
              onClick={onSave}
              disabled={!file || !text}>
        Отправить
      </Button>

    </Stack>
  );
};