import * as React from "react";
import {Pagination, Stack} from "@mui/material";
import {get, deleteJson} from "../api/1.0/index";
import {NewsItem} from "../types";
import {NewsItemView} from "./NewsItemView";

interface Props {
  managing: boolean;
}

export type NewsResp = {
  /**
   * Общее кол-во страниц
   */
  total_page_count: number;

  /**
   * Список новостей
   */
  news: NewsItem[];
}

export const NewsFeed = (props: Props) => {

  const [total, setTotal] = React.useState(0);
  const [news, setNews] = React.useState<NewsItem[]>([]);

  const [size, setSize] = React.useState(10);
  const [page, setPage] = React.useState(0);

  const refresh = React.useCallback(() => {
    get('/news', ['page', page + ''], ['size', size + ''])
      .then(x => {
        if (x.status !== 200) {
          throw new Error(x.status + '');
        }

        return x.json();
      })
      .then((x: NewsResp) => {
        const {total_page_count, news} = x;
        setTotal(total_page_count);
        setNews(news);
      })
      .catch(x => {
        console.log(x);
      })
  }, [size, page]);

  const onDelete = React.useCallback((id: string) => {
    deleteJson('/news', {id})
      .then(x => {
        refresh();
      })
      .catch(x => {
        console.log(x);
      })
  }, []);

  const [newsJsx, setNewsJsx] = React.useState<JSX.Element[]>([]);
  React.useEffect(() => {
    let elements: JSX.Element[] = news.map(x => {
      return <NewsItemView managing={props?.managing}
                           onDelete={() => onDelete(x.id)}
                           source={x}/>;
    });
    setNewsJsx(elements);
  }, [news, props?.managing]);

  React.useEffect(refresh, [refresh]);

  return (
    <div>

      <Stack spacing={2}> {newsJsx}</Stack>

      <Pagination count={total}
                  page={page}
                  onChange={(event, page1) => setPage(page1)}
                  color="primary"/>
    </div>
  )
}