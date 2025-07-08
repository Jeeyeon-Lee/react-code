import { Modal, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { ModalFuncProps } from 'antd';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';

const gridSearch = (gridInstance: any, params: any) => {
    gridInstance?.search?.(params);
};

const modalClose = () => {
    // Zustand로 모달 상태 false 처리 예정
};

const i18n = (code: string): string => {
    const messages: Record<string, string> = {
        '전화걸기': 'Make Call',
        '최근_통화': 'Recent Call',
        '직접_입력': 'Manual Input'
    };
    return messages[code] || code;
};

interface ShowModalProps extends ModalFuncProps {
    type: "error" | "confirm" | "info" | "warning" | "success" | "warn" | undefined;
    duration?: number;
}

export const modal = (props: ShowModalProps) => {
    const {
        type,
        title,
        content,
        onOk,
        onCancel,
        okText = '확인',
        cancelText = '취소',
        duration = 2,
        ...rest
    } = props;

    switch (type) {
        case 'confirm':
            Modal.confirm({ title, content, okText, cancelText, onOk, onCancel, ...rest });
            break;
        case 'info':
            Modal.info({ title, content, onOk, ...rest });
            break;
        case 'warning':
            Modal.warning({ title, content, onOk, onCancel, ...rest });
            break;
        case 'error':
            Modal.error({ title, content, onOk, ...rest });
            break;
        case 'success':
            message.success(content || title, duration);
            break;
        case 'warn':
            message.warning(content || title, duration);
            break;
        default:
            console.warn('지원되지 않는 모달 타입입니다.');
            break;
    }
};

interface BaseSearchForm {
    sd?: string;
    ed?: string;
    sk?: string;
    sv?: string;
    'range-picker'?: [Dayjs, Dayjs];
    [key: string]: any;
}

export const formSearch = <T extends BaseSearchForm>(fieldsValue: Partial<T>): T => {
    const rangeValue = fieldsValue['range-picker'];

    const values = {
        ...fieldsValue,
        sd: rangeValue?.[0]?.format('YYYY-MM-DD'),
        ed: rangeValue?.[1]?.format('YYYY-MM-DD'),
    };

    if (values.sk && values.sv) {
        const key = values.sk as keyof T;
        values[key] = values.sv;
    }

    return values as T;
};


export const date = {
    newDate: (value?: string | Date) => value ? dayjs(value) : dayjs(),

    //salmon.date.format('20240617', 'YYYYMMDD_HHmmss');
    format: (value: string | Date | Dayjs, format: string = 'YYYY-MM-DD') =>
        dayjs(value).format(format),

    set: (value: string | Date | Dayjs, obj: Partial<Record<'year' | 'month' | 'date' | 'hour' | 'minute' | 'second', number>>) =>
        Object.entries(obj).reduce((acc, [key, val]) => {
            return acc.set(key as any, val!);
        }, dayjs(value)),

    add: (value: string | Date | Dayjs, amount: number, unit: dayjs.ManipulateType) =>
        dayjs(value).add(amount, unit),

    isBefore: (a: string | Date | Dayjs, b: string | Date | Dayjs) =>
        dayjs(a).isBefore(dayjs(b))
}

interface ExcelDownloadOptions<T> {
    data: T[];
    columns: {
        key: keyof T;
        header: string;
    }[];
    sheetName?: string;
}

export const downloadExcel = async <T>({
                                        data,
                                        columns,
                                        sheetName = 'Sheet1',
                                        }: ExcelDownloadOptions<T>) => {
    if (!data || data.length === 0) {
        modal({
            type:"warning",
            title: '다운로드 불가',
            content: '다운로드할 데이터가 없습니다.',
        });
        return;
    }

    if (!columns || columns.length === 0) {
        modal({
            type:"warning",
            title: '다운로드 불가',
            content: '다운로드할 컬럼 정보가 없습니다.',
        });
        return;
    }

    if (!sheetName) {
        modal({
            type:"warning",
            title: '다운로드 불가',
            content: '다운로드할 시트 파일명 정보가 없습니다.',
        });
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns.map(col => ({
        header: col.header,
        key: col.key as string,
        width: 20,
    }));

    data.forEach(row => {
        worksheet.addRow(row);
    });

    worksheet.columns.forEach(column => {
        column.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, sheetName);
};

export const salmon = {
    gridSearch,
    modalClose,
    i18n,
    modal,
    date,
    formSearch,
    downloadExcel
};
