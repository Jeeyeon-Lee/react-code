import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef, InputRef, TableProps } from "antd";
import {Button, Checkbox, Form, Input, Popconfirm, Table} from "antd";
import type {Code} from "@/types";
import {useDetailCodeList} from "@hooks/bo/base/code/useCode.ts";
import {salmon} from "@utils/salmon.ts";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    dataIndex: keyof Code;
    record: Code;
    handleSave: (record: Code) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
                                                                                title,
                                                                                editable,
                                                                                children,
                                                                                dataIndex,
                                                                                record,
                                                                                handleSave,
                                                                                ...restProps
                                                                            }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;
    let inputNode;

    if (dataIndex === 'orderNo') {
        inputNode = <Input type="number" ref={inputRef} />;
    } else if (dataIndex === 'useYn') {
        inputNode = (
            <Checkbox
                ref={inputRef}
                checked={record.useYn === 'Y'}
                onChange={(e) => {
                    form.setFieldsValue({ useYn: e.target.checked ? 'Y' : 'N' });
                    handleSave({ ...record, useYn: e.target.checked ? 'Y' : 'N' });
                }}
            />
        );
    } else {
        inputNode = <Input ref={inputRef} />;
    }

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[{ required: true, message: `${title} is required.` }]}
            >
                {inputNode}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingInlineEnd: 24 }}
                onClick={toggleEdit}
            >
                {children[1] || <>&nbsp;</>}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

type ColumnTypes = Exclude<TableProps<Code>["columns"], undefined>;

const CodeDetailList = ({selectedGroupCd}) => {
    const {data: detailCodeList, isLoading} = useDetailCodeList(selectedGroupCd);
    const [dataSource, setDataSource] = useState<Code[]>(detailCodeList||[]);

    useEffect(() => {
        setDataSource(detailCodeList);

    }, [detailCodeList]);

    const handleDelete = (key: Code['key']) => {
        const newData = dataSource.filter((item) => item.id !== key);
        setDataSource(newData);
    };

    const defaultColumns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[] = [
        {
            title: "",
            dataIndex: "id",
            hidden: true,
        },
        {
            title: "개별코드",
            dataIndex: "detailCd",
            align: 'center',
            editable: true,
        },
        {
            title: "개별코드명",
            dataIndex: "detailNm",
            editable: true,
            align: 'center',
            sorter: (a, b) => a.detailNm.localeCompare(b.detailNm),
        },
        {
            title: "순서",
            dataIndex: "orderNo",
            editable: true,
            align: 'center', width:80,
            sorter: (a, b) => a.orderNo - b.orderNo,
        },
        {
            title: "사용",
            dataIndex: "useYn",
            editable: true,
            align: 'center', width:80,
            sorter: (a, b) => a.orderNo - b.orderNo,
            render: (_, record) => (
                <Checkbox
                    checked={record.useYn === 'Y'}
                    onChange={() => {}} // 최소한 빈 onChange 필요
                />
            )
        },
        {
            title: "작성자",
            dataIndex: "regId",
            align: 'center', width:100,
        },
        {
            title: "수정자",
            dataIndex: "modiId",
            align: 'center', width:100,
        },
        {
            title: "작성일",
            dataIndex: "regDt",
            align: 'center', width:100,
        },
        {
            title: "수정일",
            dataIndex: "modiDt",
            align: 'center', width:100,
        },
        {
            title: "operation",
            dataIndex: "operation",
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleAdd = () => {
        const lastItem = dataSource[dataSource.length - 1];

        // groupCd가 비어 있으면 추가 중단
        if (!lastItem?.groupCd || lastItem.groupCd.trim() === '') {
            alert('마지막 행의 코드가 비어 있습니다. 먼저 입력해주세요.');
            return;
        }

        const uniqueId = Date.now().toString(); // 또는 uuid()
        const newData: Code = {
            id: uniqueId,
            key: uniqueId,
            detailCd: '',
            detailNm: '',
            orderNo: dataSource.length + 1,
            useYn: 'Y', // 예시 초기값
        };
        setDataSource([...dataSource, newData]);
    };

    const handleSave = (row: Code) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Code) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    return (
        <div>
            <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                Add a row
            </Button>
            <Table<Code>
                rowKey="id"
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={dataSource}
                columns={columns as ColumnTypes}
            />
        </div>
    );
};

export default CodeDetailList;
