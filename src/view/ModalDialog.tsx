import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

interface Props {
    /**
     * Открыт ли диалог
     */
    open: boolean;

    /**
     * Закрыть диалог
     */
    close: () => void;

    /**
     * Подтверждаем действие
     */
    onAction: () => void;

    /**
     * Заголовок
     */
    title: string;

    /**
     * Поясняющий тект
     */
    description: string | JSX.Element;

    /**
     * Текст кнопки подтверждения
     * По умолчанию Подтвердить
     */
    okText?: string;

    /**
     * Текст кнопки отмены
     * По умолчанию Отменить
     */
    denyText?: string;
}

export const ModalDialog = (props: Props): JSX.Element => {
    return <Dialog open={props.open}
                   onClose={props.close}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {props.description}
            </DialogContentText>
        </DialogContent>

        <DialogActions>
            <Button onClick={props.close}>{props.denyText ?? 'Отмена'}</Button>
            <Button onClick={() => {
                props.onAction();
                props.close();
            }} autoFocus variant="contained">
                {props.okText ?? 'Подтвердить'}
            </Button>
        </DialogActions>
    </Dialog>;
}