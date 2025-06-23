import React from 'react';
import {CustomerServiceOutlined} from "@ant-design/icons";

function CounselReady(props) {
    return (
        <div style={{textAlign: 'center', margin: '10px'}}>
            <CustomerServiceOutlined style={{fontSize: '40px', color: '#bbb', marginBottom: '12px'}}/>
            <div style={{fontSize: '14px', fontWeight: 500}}>
                상담준비 상태입니다.
            </div>
            <div style={{fontSize: '12px', color: '#aaa', marginBottom: '14px'}}>
                "상담가능"으로 변경 시 인바운드 상담이 가능합니다.
            </div>
        </div>
    );
}

export default CounselReady;