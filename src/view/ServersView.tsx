import * as React from 'react';
import {ModInfo, ServerDesciption} from '../types';
import * as api from '../api/1.0';
import Grid from '@mui/material/Grid';
import {Accordion, AccordionDetails, AccordionSummary, Backdrop, Link, Stack, Typography} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const ServersView = (): JSX.Element => {

  const [servers, setServers] = React.useState<ServerDesciption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [controls, setControls] = React.useState<JSX.Element[]>([]);

  const refresh = React.useCallback(() => {
    setLoading(true);

    api.get('/ownServers')
      .then(x => {
        if (x.status !== 200) {
          return x.json()
            .then(y => {
              console.log(y);
              throw new Error(y);
            });
        }

        return x.json();
      })
      .then(x => {
        const addresses = x as string[];

        const promises = addresses.map(x => api.get('/server', ['address', x])
          .then(x => {
            if (x.status !== 200) {
              return x.json()
                .then(y => {
                  console.log(y);
                  throw new Error(y);
                });
            }

            return x.json();
          }));

        return Promise.all(promises)
          .then(x => x.map(y => (y as ServerDesciption)));
      })
      .then(x => {
        setServers(x);
      })
      .catch(x => {
        console.log(x);
        setControls([]);
      })
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    setControls(servers.map(getControl));
  }, [servers]);

  React.useEffect(refresh, []);

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start">
      <Backdrop
        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={loading}>
        <CircularProgress color="inherit"/>
      </Backdrop>

      {controls?.length === 1 && (controls[0])}

      {!loading && (!controls || controls.length) === 0 && (
        <Typography sx={{fontSize: 18}}>?????????????????? ???????????????? ?????? :(</Typography>
      )}
    </Grid>
  );
};

const sortFunc = (a: ModInfo, b: ModInfo): number => {
  if (!b.page) {
    return -1;
  }

  if (!a.page) {
    return 1;
  }

  return a.modid.localeCompare(b.modid);
};

const getControl = (s: ServerDesciption): JSX.Element => {
  const {server, forge, extra} = s;

  const modsList = forge
    ?.modinfo
    ?.modList
    ?.sort(sortFunc)
    ?.map(x => {


      return <Typography paragraph>
        {x.page
          ? (
            <Link sx={{fontSize: 20, fontWeight: 'bold'}} href={x.page}>{x.modid}</Link>
          )
          : (
            <Typography sx={{fontSize: 16}}>{x.modid}</Typography>
          )}

        {x.desc && (
          <Typography sx={{fontSize: 16}} paragraph={true}>{x.desc}</Typography>
        )}

      </Typography>
    });

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      rowSpacing={1}>

      <Grid item>
        <Typography sx={{fontSize: 42}} gutterBottom>
          {server.motd.raw.join('\n') ?? '????????????'}
        </Typography>
      </Grid>


      <Grid item>
        <Typography sx={{fontSize: 24, mt: 5, color: 'accent'}} gutterBottom>
          ???????????????????? ?? ??????????????:
        </Typography>
      </Grid>

      {extra?.htmlWidget && (
        <div dangerouslySetInnerHTML={{__html: extra.htmlWidget as string}}/>
      )}

      <Grid item>
        <Typography sx={{fontSize: 16}} gutterBottom>
          ???????????? Minecraft: {forge?.version?.name ?? server?.version}
        </Typography>
      </Grid>

      <Grid item>
        <Typography sx={{fontSize: 16}} gutterBottom>
          ?????????? ??????????????: {server.ip + ':' + server.port}
        </Typography>
      </Grid>

      <Grid item>
        <Typography sx={{fontSize: 16}} gutterBottom>
          ????????????: {forge?.players?.online ?? server?.players?.online} ???? {forge?.players?.max ?? server?.players?.max}
        </Typography>
      </Grid>

      {forge?.players?.sample?.length > 0 && (
        <Grid item>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              ???????????? ?????????????? ???? ??????????????
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2} direction='column'>
                {forge.players.sample.map(x => x.name)
                  .sort((a, b) => a.localeCompare(b))
                  .map(x => (
                    <Typography sx={{fontSize: 16}} gutterBottom>{x}</Typography>
                  ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Grid>
      )}

      {modsList?.length > 0 && (
        <>
          <Grid item>
            <Typography sx={{fontSize: 24, mt: 5, color: 'accent'}} gutterBottom>
              ???????????? Forge ??????????????????????:
            </Typography>
          </Grid>

          {modsList.map(x => {
            return <Grid item>{x}</Grid>;
          })}
        </>
      )}
    </Grid>
  );
};