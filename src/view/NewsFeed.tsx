import * as React from "react";
import {Pagination, Stack} from "@mui/material";
import {get, deleteJson} from "../api/1.0/index";
import {NewsItem} from "../types";
import {NewsItemView} from "./NewsItemView";

interface Props {
  canDelete: boolean;
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
  const [page, setPage] = React.useState(1);

  const refresh = React.useCallback(() => {


    get('/news', ['page', page - 1 + ''], ['size', size + ''])
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

  const onDelete = React.useCallback((_id: string) => {
    deleteJson('/news', {_id})
      .then(x => {
        refresh();
      })
      .catch(x => {
        console.log(x);
      })
  }, []);

  const [newsJsx, setNewsJsx] = React.useState<JSX.Element[]>([]);
  React.useEffect(() => {
    let elements: JSX.Element[] = news.map((x, index) => {
      return <NewsItemView key={index}
                           managing={props?.canDelete}
                           onDelete={() => onDelete(x._id)}
                           source={x}/>;
    });
    setNewsJsx(elements);
  }, [news, props?.canDelete]);

  React.useEffect(refresh, [refresh]);

  return (
    <Stack spacing={2}>
      {newsJsx}

      {newsJsx.length > 0 && (
        <Pagination count={total}
                    page={page}
                    onChange={(event, page1) => setPage(page1)}
                    color="primary"/>
      )}
    </Stack>
  )
}