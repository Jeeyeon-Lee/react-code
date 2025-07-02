import React, {useContext, useEffect, useRef, useState} from "react";
import type {GetRef, InputRef, TableProps} from "antd";
import {Button, Checkbox, Form, Input, message, Popconfirm, Table} from "antd";
import type {Code} from "@/types";
import {useCrudDetailCode, useDetailCodeList} from "@hooks/bo/base/code/useCode.ts";
import CmmForm from "@components/form/CmmForm.tsx";
import {smMax, smMin, smPattern, smRegex, smRequired, smValidateBuilder} from "@utils/form/smValidateBuilder.ts";
import type {Rule} from "rc-field-form/lib/interface";
import queryClient from "@query/queryClient.ts";

type FormInstance<T> = GetRef<typeof Form<T>>;
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
    index: number;
}
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <CmmForm form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </CmmForm>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    dataIndex: keyof Code;
    record: Code;
    handleSave: (record: Code) => void;
    dataSource: Code[];
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
                                                                                title,
                                                                                editable,
                                                                                children,
                                                                                dataIndex,
                                                                                record,
                                                                                handleSave,
                                                                                dataSource,
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

            if(errInfo.errorFields[0].errors[0] === "코드값은 중복될 수 없습니다.") {
                form.resetFields();
            }

        }
    };

    let childNode = children;

    const inputNode = (() => {
        if (dataIndex === "orderNo") {
            return <Input type="number" ref={inputRef} onPressEnter={save} onBlur={save} />;
        } else if (dataIndex === "useYn") {
            return (
                <Checkbox
                    checked={record.useYn === "Y"}
                    onChange={(e) => {
                        const updated = { ...record, useYn: e.target.checked ? "Y" : "N" };
                        handleSave(updated);
                    }}
                />
            );
        } else {
            return <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
        }
    })();

    let rules: Rule[] = [];

    if (dataIndex === 'detailCd') {
        rules = smValidateBuilder(
            smRequired(),
            smMin(2),
            smMax(20),
            smPattern(smRegex.code.pattern, smRegex.code.message)
        );

        rules.push({

            validator:(_rule, value) => {
                if (!value || !value.trim()) return Promise.resolve();

                const duplicates = dataSource.filter(
                    (item) => item.detailCd === value && item.id !== record.id
                );

                if (duplicates.length > 0) {
                    return Promise.reject("코드값은 중복될 수 없습니다.");
                }
                return Promise.resolve();
            }
        })

    } else if (dataIndex === 'detailNm') {
        rules = smValidateBuilder(
            smRequired(),
            smMin(2),
            smMax(20)
        );
    } else {
        rules = []; // orderNo, useYn 등은 검증 없음
    }

    if (editable && dataIndex !== "useYn") {
        childNode = editing ? (
            <Form.Item
                messageVariables={{label: title}}
                style={{ margin: 0 }}
                name={dataIndex}
                rules={rules}
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
    } else if (editable && dataIndex === "useYn") {
        childNode = inputNode;
    }

    return <td {...restProps}>{childNode}</td>;
};

type ColumnTypes = Exclude<TableProps<Code>["columns"], undefined>;

const CodeDetailList = ({ selectedGroupCd }) => {
    const { data: detailCodeList, isLoading } = useDetailCodeList(selectedGroupCd);
    const [dataSource, setDataSource] = useState<Code[]>([]);
    const [modifiedRows, setModifiedRows] = useState<Code[]>([]);
    const [deletedRows, setDeletedRows] = useState<Code[]>([]);
    const {mutate: crudDetailCode} = useCrudDetailCode();
    const [isModified, setIsModified] = useState<boolean>(false);

    useEffect(() => {
        setIsModified(modifiedRows.length === 0 && deletedRows.length === 0);
    }, [modifiedRows, deletedRows]); // modifiedRows가 변경될 때마다 이 이펙트가 다시 실행됩니다.

    useEffect(() => {
        setDataSource(detailCodeList || []);
        setModifiedRows([]);

    }, [detailCodeList]);

    const handleDelete = (key: Code["key"]) => {
        const deletedItem = dataSource.find((item) => item.id === key);
        const newData = dataSource.filter((item) => item.id !== key);
        setDataSource(newData);

        // 수정 목록에서도 제외
        setModifiedRows((prev) => prev.filter((item) => item.id !== key));

        // 삭제 항목으로 추가 (기존에 존재하던 데이터만 기록)
        if (deletedItem && !deletedItem.isNew) {
            setDeletedRows((prev) => [...prev, deletedItem]);
        }
    };

    const handleSave = (row: Code) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.id === item.id);
        const updated = { ...newData[index], ...row };
        newData.splice(index, 1, updated);
        setDataSource(newData);

        setModifiedRows((prev) => {
            const exists = prev.find((p) => p.id === row.id);
            if (exists) {
                return prev.map((p) => (p.id === row.id ? row : p));
            } else {
                return [...prev, row]; // ✅ 배열 유지
            }
        });

    };

    const handleAdd = () => {

        if(!selectedGroupCd) {
            alert("선택된 그룹코드가 없습니다.");
            return;
        }

        const lastItem = dataSource[dataSource.length - 1];
        if (lastItem && (!lastItem?.detailCd || lastItem.detailCd.trim() === "")) {
            alert("마지막 행의 코드가 비어 있습니다. 먼저 입력해주세요.");
            return;
        }

        const uniqueId = Date.now().toString();
        const newData: Code = {
            id: uniqueId,
            key: uniqueId,
            detailCd: "",
            detailNm: "",
            orderNo: dataSource.length + 1,
            useYn: "Y",
            groupCd: selectedGroupCd,
            isNew: true
        };
        setDataSource([...dataSource, newData]);
    };
    

    const handleBulkSave = async () => {

        if (modifiedRows.length === 0 && deletedRows.length === 0) {
            alert("수정되거나 삭제된 항목이 없습니다.");
            return;
        }

        try {
            const insertList = modifiedRows.filter((r) => r.isNew);
            const updateList = modifiedRows.filter((r) => !r.isNew);
            const deleteList = deletedRows;

            // 필수값 누락 체크
            const hasInvalid = [...insertList, ...updateList].some(
                (r) => !r.detailCd?.trim() || !r.detailNm?.trim()
            );

            if (hasInvalid) {
                alert("개별코드 및 개별코드명을 모두 입력해주세요.");
                return;
            }
            const dataToSave = {
                insertList,
                updateList,
                deleteList,
            };

            crudDetailCode(dataToSave, { // mutate 함수 호출 시 onSuccess 콜백 정의
                onSuccess: async () => {
                    // 여기서는 `selectedGroupCd`에 클로저로 접근할 수 있습니다.
                    await queryClient.invalidateQueries({
                        queryKey: ['detailCodeList', selectedGroupCd], // groupCd를 쿼리 키에 포함
                    });
                    message.success(`변경사항이 저장되었습니다.`);
                },
            });

            alert("저장 완료");
            setModifiedRows([]);
            setDeletedRows([]);
        } catch (e) {
            console.error("저장 실패:", e);
            alert("저장 실패");
        }
    };

    const defaultColumns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[] = [
        { title: "", dataIndex: "id", hidden: true },
        { title: "개별코드", dataIndex: "detailCd",
            editable: true, align: "center" },
        {
            title: "개별코드명",
            dataIndex: "detailNm",
            editable: true,
            align: "center",
            sorter: (a, b) => a.detailNm.localeCompare(b.detailNm),
        },
        {
            title: "순서",
            dataIndex: "orderNo",
            editable: true,
            align: "center",
            width: 80,
            sorter: (a, b) => a.orderNo - b.orderNo,
        },
        {
            title: "사용",
            dataIndex: "useYn",
            editable: true,
            align: "center",
            width: 80,
            sorter: (a, b) => a.orderNo - b.orderNo,
        },
        { title: "작성자", dataIndex: "regId", align: "center", width: 100 },
        { title: "수정자", dataIndex: "modiId", align: "center", width: 100 },
        { title: "작성일", dataIndex: "regDt", align: "center", width: 100 },
        { title: "수정일", dataIndex: "modiDt", align: "center", width: 100 },
        {
            title: "operation",
            dataIndex: "operation",
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="삭제하시겠습니까?" onConfirm={() => handleDelete(record.id)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns
        .filter((col) => !col.hidden)
        .map((col) => {
            if (!col.editable) return col;

            return {
                ...col,
                onCell: (record: Code) => {
                    const isNew = record.isNew === true;
                    const editableField =
                        col.dataIndex === "detailCd" ? isNew : true; // ✅ 조건 분기

                    return {
                        record,
                        editable: editableField,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        handleSave,
                        dataSource
                    };
                },
            };
        });

    return (
        <div>
            <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                추가
            </Button>

            <Button disabled={isModified} onClick={handleBulkSave} style={{ marginLeft: 8 }}>
                변경사항 저장
            </Button>
            <Table<Code>
                rowKey="id"
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={dataSource}
                columns={columns as ColumnTypes}
                pagination={false}
            />
        </div>
    );
};

export default CodeDetailList;
