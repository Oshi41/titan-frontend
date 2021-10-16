import {Button, Grid, Card, CardContent, Typography} from "@mui/material";
import {deleteJson} from "../api/1.0/index";
import {NewsItem} from "../types";

interface Props {
  source?: NewsItem;
  managing: boolean;
  onDelete: () => void;
}

export const NewsItemView = (props: Props): JSX.Element => {
  // @ts-ignore
  let dateString: any = new Date(props?.source?.date).toLocaleString();

  const onClick = (e: any) => {
    props?.onDelete();
  };

  return (
    <Card sx={{minWidth: 275, maxWidth: '100%'}} elevation={24}>
      <CardContent>
        <Grid container direction='row'>
          <Grid item xs={true}>
            <Typography variant='h4'
                        sx={{fontWeight: 'bold'}}
                        component="div"
                        color='#5e9ca0'>
              {props?.source?.name}
            </Typography>
          </Grid>

          <Grid item>
            <Grid container direction='column'>
              <Typography sx={{fontSize: 14, textDecoration: 'underline'}} noWrap>
                {dateString}
              </Typography>

              {props.managing && (
                <Button onClick={onClick}>Удалить</Button>
              )}
            </Grid>
          </Grid>

        </Grid>

        <div dangerouslySetInnerHTML={{__html: props?.source?.html as string}}/>

        <Typography sx={{fontSize: 14, textDecoration: 'italic', fontWeight: 'lighter', mt: 5}} noWrap>
          Автор: {props?.source?.author}
        </Typography>
      </CardContent>
    </Card>
  );
}