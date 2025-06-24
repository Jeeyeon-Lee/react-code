import React, {useEffect, useMemo, useState} from 'react';
import type {TreeDataNode, TreeProps} from 'antd';
import {Card, Col, Row, Tree} from 'antd';
import type {MenuType} from "@/types";
import {useMenuListStore} from "@stores/bo/base/menu/menuStore.ts";
import MenuForm from "@pages/bo/base/menu/MenuForm.tsx";
import {MoveMenuMutation} from "@hooks/bo/base/menu/useMenu.ts";
import MenuInsertForm from "@pages/bo/base/menu/MenuInsertForm.tsx";

function menuTreeData(menuList: MenuType[], parentCd: string): TreeDataNode[] {
    return menuList
        .filter(m => m.highMenuCd === parentCd && m.menuCd !== parentCd) // 무한 루프 방지
        .map(m => {
            const children = menuTreeData(menuList, m.menuCd);
            return {
                menuCd: m.menuCd,
                highMenuCd: m.highMenuCd,
                key: m.menuCd,
                title: m.label,
                children: children.length > 0 ? children : undefined,
            } as TreeDataNode;
        });
}

const MenuContent = () => {
    // init menuList setting
    const menuList = useMenuListStore(state => state.menuList);

    const treeData = useMemo(() => menuTreeData(menuList, 'ROOT'), [menuList]);
    const [gData, setGData] = useState(treeData);
    const [selectedMenuCd, setSelectedMenuCd] = useState(null);
    const {mutate: moveMenu} = MoveMenuMutation();

    useEffect(() => {
        // defaultData가 변경될 때마다 gData를 업데이트
        setGData(treeData);
    }, [treeData, gData]); // defaultData가 변경될 때마다 이 useEffect가 실행됩니다.

    const onSelect = (selectedKeys) => {
        const key = selectedKeys[0];
        if (key) {
            setSelectedMenuCd(key);
        }
    };

    const onDragEnter: TreeProps['onDragEnter'] = (info) => {
        // expandedKeys, set it when controlled is needed
        // setExpandedKeys(info.expandedKeys)
    };

    const onDrop: TreeProps['onDrop'] = (info) => {

        //drop 된 위치 데이터
        const dropKey = info.node.key;
        const dropHighMenuCd = info.node.highMenuCd;

        //drag 해서 옮기는 데이터
        const dragKey = info.dragNode.key;

        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const data = [...gData];
        let dragObj: TreeDataNode;

        const loop = (
            data: TreeDataNode[],
            key: React.Key,
            callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void,
        ) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children!, key, callback);
                }
            }
        };

        // remove dragged item
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        // drag 데이터 highMenuCd, orderNo 세팅
        let newParentKey: string;
        let newOrderNo: number;

        if (!info.dropToGap) {
            // 내부에 드롭
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                item.children.unshift(dragObj!);

                newParentKey = dropKey;
                newOrderNo = 0; // 가장 위로 간 것
            });
        } else {
            // 위/아래에 드롭
            let siblings: TreeDataNode[] = [];
            let i: number;
            loop(data, dropKey, (_item, index, arr) => {
                siblings = arr;
                i = index;
            });

            if (dropPosition === -1) {
                siblings.splice(i!, 0, dragObj!);
                newParentKey = dropHighMenuCd; // dropNode의 부모
                newOrderNo = i!;
            } else {
                siblings.splice(i! + 1, 0, dragObj!);
                newParentKey = dropHighMenuCd;
                newOrderNo = i! + 1;
            }
        }

        // order no 업데이트
        const moveMenuValues = {
            menuCd: dragKey,
            values: {
                highMenuCd: newParentKey,
                orderNo: newOrderNo + 1
            }
        };

        // moveMenu -> db update // setGdata -> tree update
        moveMenu(moveMenuValues);
        setGData(data);
    };


    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card title="메뉴">
                    <Tree
                        className="draggable-tree"
                        draggable
                        blockNode
                        onDragEnter={onDragEnter}
                        onDrop={onDrop}
                        treeData={gData}
                        onSelect={onSelect}

                    />
                </Card>
            </Col>
            <Col span={16}>
                <Card title="메뉴 상세 정보">
                    {selectedMenuCd ? (
                        <MenuForm
                            selectedMenuCd={selectedMenuCd}
                            setSelectedMenuCd={setSelectedMenuCd}
                            />
                        ) : (
                        <p>좌측 트리에서 메뉴를 선택해주세요.</p>
                    )}
                </Card>
                {selectedMenuCd ? (
                    <Card title="메뉴 추가">
                    <MenuInsertForm
                        selectedMenuCd={selectedMenuCd}
                        />
                    </Card>
                ) : ('')}
            </Col>
        </Row>

    );
};

export default MenuContent;