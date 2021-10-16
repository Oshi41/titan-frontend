import {Button, createTheme, Link, Stack, TextField} from '@mui/material';
import * as React from 'react';
import {postJson} from "../api/1.0/index";
import {useControlledCookieState} from "../hook/useControlledCookieState";
import {NewsItem, UserInfo, WebToken} from '../types';
import {getToken} from "../utils/index";

interface Props {
  source: NewsItem;
}

export const AddNews = (props: Props): JSX.Element => {

  const [copy, setCopy] = React.useState<NewsItem>();
  const [wasSaved, setWasSaved] = React.useState<boolean | undefined>(undefined);
  const [text, setText] = React.useState('');

  const [name, setName] = useControlledCookieState('news_n', '');
  const [html, setHtml] = useControlledCookieState('news_h', '');

  React.useEffect(() => {
    setCopy({...props?.source});

    if (props.source?.name) {
      setName(props.source?.name);
    }

    if (props.source?.html) {
      setHtml(props.source?.html);
    }
  }, [props.source]);

  React.useEffect(() => {
    setCopy({...copy, name, html} as NewsItem);

  }, [name, html]);

  const onSave = (e: any) => {
    setWasSaved(undefined);

    const result = {...copy};

    if (!result.author) {
      let token: WebToken | undefined = getToken();
      result.author = token?.login;
    }

    if (!result.date) {
      result.date = new Date();
    }

    postJson('/news', result)
      .then(x => {
        if (x.status !== 200) {
          throw new Error('wrong status');
        }

        return x.text();
      })
      .then(x => {
        setHtml('');
        setName('');
        setWasSaved(true);
        setText('Новость успешно сохранена');
      })
      .catch(x => {
        console.log(x);
        setWasSaved(false);
        setText(x + '');
      });
  };

  return (
    <Stack direction='column'
           spacing={2}>

      <TextField
        id="text_name"
        label="Заголовок новости"
        defaultValue={name}
        onChange={event => setName(event.target.value)}
        helperText={text ?? 'Введите название новости'}
        color={wasSaved === true ? 'success' : 'primary'}
        error={wasSaved === false}
      />

      <TextField
        id="text_content"
        label="HTML контент"
        defaultValue={html}
        onChange={event => setHtml(event.target.value)}
        multiline
        rows={15}
        maxRows={15}
        helperText={<Link href='https://html-online.com/editor/' target='_blank'>Используй готовые редакторы</Link>}
      />

      <Button variant='contained'
              onClick={onSave}
              disabled={!copy?.name || !copy?.html}>
        Загрузить
      </Button>
    </Stack>
  );
};